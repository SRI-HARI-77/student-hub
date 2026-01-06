import { motion } from 'framer-motion';
import { Edit2, Trash2, Mail, Phone, Calendar, MapPin, BookOpen, Users } from 'lucide-react';
import { Student } from '@/hooks/useStudents';
import { GradientButton } from '@/components/ui/GradientButton';

interface StudentCardProps {
  student: Student;
  onEdit: (student: Student) => void;
  onDelete: (student: Student) => void;
  index: number;
}

export function StudentCard({ student, onEdit, onDelete, index }: StudentCardProps) {
  const formatDate = (date: string | null) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      className="glass-card rounded-xl p-5 hover:shadow-xl transition-all duration-300 group"
    >
      <div className="flex items-start gap-4">
        <div className="relative">
          {student.profile_image_url ? (
            <img
              src={student.profile_image_url}
              alt={student.full_name}
              className="w-16 h-16 rounded-xl object-cover ring-2 ring-border/50"
            />
          ) : (
            <div className="w-16 h-16 gradient-primary rounded-xl flex items-center justify-center text-primary-foreground font-bold text-xl">
              {student.full_name.charAt(0).toUpperCase()}
            </div>
          )}
          {student.gender && (
            <span className="absolute -bottom-1 -right-1 w-6 h-6 bg-card rounded-full border border-border flex items-center justify-center text-xs">
              {student.gender === 'Male' ? '♂' : student.gender === 'Female' ? '♀' : '⚧'}
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg font-display text-foreground truncate">
            {student.full_name}
          </h3>
          
          <div className="mt-2 space-y-1.5">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">{student.email}</span>
            </div>
            
            {student.phone && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{student.phone}</span>
              </div>
            )}
            
            {student.course_or_department && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <BookOpen className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">{student.course_or_department}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <GradientButton
            variant="ghost"
            size="sm"
            onClick={() => onEdit(student)}
            className="w-8 h-8 p-0"
          >
            <Edit2 className="w-4 h-4" />
          </GradientButton>
          <GradientButton
            variant="ghost"
            size="sm"
            onClick={() => onDelete(student)}
            className="w-8 h-8 p-0 hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </GradientButton>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-border/50 grid grid-cols-2 gap-3 text-xs text-muted-foreground">
        {student.date_of_birth && (
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(student.date_of_birth)}</span>
          </div>
        )}
        {student.batch_or_year && (
          <div className="flex items-center gap-1.5">
            <Users className="w-3 h-3" />
            <span>{student.batch_or_year}</span>
          </div>
        )}
        {student.address && (
          <div className="flex items-center gap-1.5 col-span-2">
            <MapPin className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{student.address}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
