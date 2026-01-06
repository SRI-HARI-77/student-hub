import { motion } from 'framer-motion';
import { Users, Plus } from 'lucide-react';
import { GradientButton } from '@/components/ui/GradientButton';

interface EmptyStateProps {
  onAddStudent: () => void;
}

export function EmptyState({ onAddStudent }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      <div className="w-20 h-20 gradient-subtle rounded-2xl flex items-center justify-center mb-6">
        <Users className="w-10 h-10 text-primary" />
      </div>
      <h3 className="text-xl font-bold font-display text-foreground mb-2">
        No students yet
      </h3>
      <p className="text-muted-foreground text-center max-w-md mb-6">
        Get started by adding your first student. You can add their details, 
        upload a profile photo, and manage their records.
      </p>
      <GradientButton onClick={onAddStudent} className="gap-2">
        <Plus className="w-4 h-4" />
        Add Student
      </GradientButton>
    </motion.div>
  );
}
