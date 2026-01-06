import { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, User } from 'lucide-react';
import { studentSchema, StudentFormData } from '@/lib/validations';
import { Student, useStudents } from '@/hooks/useStudents';
import { GradientButton } from '@/components/ui/GradientButton';
import { GradientInput } from '@/components/ui/GradientInput';
import { toast } from '@/hooks/use-toast';

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  student?: Student | null;
}

export function StudentModal({ isOpen, onClose, student }: StudentModalProps) {
  const { createStudent, updateStudent, uploadImage } = useStudents();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isEditing = !!student;

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      full_name: '',
      email: '',
      phone: '',
      date_of_birth: '',
      gender: '',
      course_or_department: '',
      batch_or_year: '',
      address: '',
    },
  });

  useEffect(() => {
    if (student) {
      reset({
        full_name: student.full_name,
        email: student.email,
        phone: student.phone || '',
        date_of_birth: student.date_of_birth || '',
        gender: student.gender || '',
        course_or_department: student.course_or_department || '',
        batch_or_year: student.batch_or_year || '',
        address: student.address || '',
      });
      setImagePreview(student.profile_image_url);
    } else {
      reset({
        full_name: '',
        email: '',
        phone: '',
        date_of_birth: '',
        gender: '',
        course_or_department: '',
        batch_or_year: '',
        address: '',
      });
      setImagePreview(null);
    }
    setImageFile(null);
  }, [student, reset, isOpen]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "Image size should be less than 5MB",
          variant: "destructive",
        });
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Error",
          description: "Please upload a valid image file",
          variant: "destructive",
        });
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data: StudentFormData) => {
    try {
      setIsUploading(true);
      let profileImageUrl = student?.profile_image_url || null;

      if (imageFile) {
        const uploadedUrl = await uploadImage(imageFile);
        if (uploadedUrl) {
          profileImageUrl = uploadedUrl;
        }
      }

      const studentData = {
        full_name: data.full_name,
        email: data.email,
        phone: data.phone || null,
        date_of_birth: data.date_of_birth || null,
        gender: data.gender || null,
        course_or_department: data.course_or_department || null,
        batch_or_year: data.batch_or_year || null,
        address: data.address || null,
        profile_image_url: profileImageUrl,
      };

      if (isEditing && student) {
        await updateStudent.mutateAsync({ id: student.id, ...studentData });
      } else {
        await createStudent.mutateAsync(studentData);
      }

      onClose();
    } catch (error) {
      // Error is handled in the mutation
    } finally {
      setIsUploading(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/20 backdrop-blur-sm"
          onClick={handleBackdropClick}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, type: "spring", damping: 25, stiffness: 300 }}
            className="w-full max-w-lg max-h-[90vh] overflow-y-auto glass-card rounded-2xl shadow-2xl"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-border/50 bg-card/95 backdrop-blur-sm rounded-t-2xl">
              <h2 className="text-xl font-bold font-display gradient-text">
                {isEditing ? 'Edit Student' : 'Add Student'}
              </h2>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
              {/* Image Upload */}
              <div className="flex justify-center">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="relative cursor-pointer group"
                >
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-24 h-24 rounded-2xl object-cover ring-4 ring-border/50 group-hover:ring-primary/50 transition-all"
                    />
                  ) : (
                    <div className="w-24 h-24 gradient-subtle rounded-2xl flex items-center justify-center border-2 border-dashed border-border group-hover:border-primary/50 transition-all">
                      <User className="w-10 h-10 text-muted-foreground" />
                    </div>
                  )}
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 gradient-primary rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Upload className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
              </div>
              <p className="text-center text-xs text-muted-foreground">
                Click to upload profile image
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <GradientInput
                    label="Full Name *"
                    placeholder="Enter student full name"
                    error={errors.full_name?.message}
                    {...register('full_name')}
                  />
                </div>

                <GradientInput
                  type="email"
                  label="Email *"
                  placeholder="Enter email address"
                  error={errors.email?.message}
                  {...register('email')}
                />

                <GradientInput
                  label="Phone"
                  placeholder="Enter phone number"
                  error={errors.phone?.message}
                  {...register('phone')}
                />

                <GradientInput
                  type="date"
                  label="Date of Birth"
                  error={errors.date_of_birth?.message}
                  {...register('date_of_birth')}
                />

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-foreground">
                    Gender
                  </label>
                  <select
                    className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    {...register('gender')}
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <GradientInput
                  label="Course / Department"
                  placeholder="Select course or department"
                  error={errors.course_or_department?.message}
                  {...register('course_or_department')}
                />

                <GradientInput
                  label="Batch / Year"
                  placeholder="e.g., 2024"
                  error={errors.batch_or_year?.message}
                  {...register('batch_or_year')}
                />

                <div className="sm:col-span-2">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-foreground">
                      Address
                    </label>
                    <textarea
                      className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none"
                      rows={3}
                      placeholder="Enter address"
                      {...register('address')}
                    />
                    {errors.address && (
                      <p className="text-sm text-destructive">{errors.address.message}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <GradientButton
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={onClose}
                >
                  Cancel
                </GradientButton>
                <GradientButton
                  type="submit"
                  className="flex-1"
                  loading={isSubmitting || isUploading}
                >
                  {isEditing ? 'Update' : 'Save'}
                </GradientButton>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
