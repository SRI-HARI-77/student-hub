import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, apiMultipart } from '@/lib/api';
import { toast } from '@/hooks/use-toast';

export interface Student {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  date_of_birth: string | null;
  gender: string | null;
  course_or_department: string | null;
  batch_or_year: string | null;
  address: string | null;
  profile_image_url: string | null;
  created_at: string;
  updated_at: string;
}

interface BackendStudent {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  courseOrDepartment?: string;
  batchOrYear?: string;
  address?: string;
  profileImageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

const transformBackendStudent = (student: BackendStudent): Student => ({
  id: student._id,
  full_name: student.fullName,
  email: student.email,
  phone: student.phone || null,
  date_of_birth: student.dateOfBirth || null,
  gender: student.gender || null,
  course_or_department: student.courseOrDepartment || null,
  batch_or_year: student.batchOrYear || null,
  address: student.address || null,
  profile_image_url: student.profileImageUrl || null,
  created_at: student.createdAt,
  updated_at: student.updatedAt,
});

const transformStudentForBackend = (student: Omit<Student, 'id' | 'created_at' | 'updated_at'>) => ({
  fullName: student.full_name,
  email: student.email,
  phone: student.phone,
  dateOfBirth: student.date_of_birth,
  gender: student.gender,
  courseOrDepartment: student.course_or_department,
  batchOrYear: student.batch_or_year,
  address: student.address,
  profileImageUrl: student.profile_image_url,
});

export type StudentInput = Omit<Student, 'id' | 'created_at' | 'updated_at'>;

export function useStudents() {
  const queryClient = useQueryClient();

  const { data: students = [], isLoading, error } = useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      const response = await api('/students');
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to fetch students');
      }
      return (response.data as BackendStudent[]).map(transformBackendStudent);
    },
  });

  const createStudent = useMutation({
    mutationFn: async (student: StudentInput) => {
      const formData = new FormData();
      const transformed = transformStudentForBackend(student);

      Object.entries(transformed).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, String(value));
        }
      });

      const response = await apiMultipart('/students', formData);
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to create student');
      }
      return transformBackendStudent(response.data as BackendStudent);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast({
        title: "Success",
        description: "Student added successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateStudent = useMutation({
    mutationFn: async ({ id, ...student }: Partial<Student> & { id: string }) => {
      const formData = new FormData();
      const transformed = transformStudentForBackend(student as any);

      Object.entries(transformed).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, String(value));
        }
      });

      const response = await apiMultipart(`/students/${id}`, formData, { method: 'PUT' });
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to update student');
      }
      return transformBackendStudent(response.data as BackendStudent);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast({
        title: "Success",
        description: "Student updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteStudent = useMutation({
    mutationFn: async (id: string) => {
      const response = await api(`/students/${id}`, { method: 'DELETE' });
      if (!response.success) {
        throw new Error(response.message || 'Failed to delete student');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast({
        title: "Success",
        description: "Student deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await apiMultipart('/students/upload-image', formData);
      if (!response.success || !response.url) {
        throw new Error(response.message || 'Failed to upload image');
      }

      return response.url;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
      return null;
    }
  };

  return {
    students,
    isLoading,
    error,
    createStudent,
    updateStudent,
    deleteStudent,
    uploadImage,
  };
}
