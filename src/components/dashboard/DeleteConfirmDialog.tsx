import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import { GradientButton } from '@/components/ui/GradientButton';

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  studentName: string;
  isDeleting: boolean;
}

export function DeleteConfirmDialog({ 
  isOpen, 
  onClose, 
  onConfirm, 
  studentName,
  isDeleting 
}: DeleteConfirmDialogProps) {
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
            className="w-full max-w-md glass-card rounded-2xl shadow-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-destructive" />
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <h3 className="text-xl font-bold font-display text-foreground mb-2">
              Delete Student
            </h3>
            <p className="text-muted-foreground mb-6">
              Are you sure you want to delete <strong>{studentName}</strong>? 
              This action cannot be undone.
            </p>

            <div className="flex gap-3">
              <GradientButton
                variant="outline"
                className="flex-1"
                onClick={onClose}
                disabled={isDeleting}
              >
                Cancel
              </GradientButton>
              <GradientButton
                variant="destructive"
                className="flex-1"
                onClick={onConfirm}
                loading={isDeleting}
              >
                Delete
              </GradientButton>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
