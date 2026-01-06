import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Users, Loader2 } from 'lucide-react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { StudentCard } from '@/components/dashboard/StudentCard';
import { StudentModal } from '@/components/dashboard/StudentModal';
import { DeleteConfirmDialog } from '@/components/dashboard/DeleteConfirmDialog';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { GradientButton } from '@/components/ui/GradientButton';
import { useStudents, Student } from '@/hooks/useStudents';

export default function Dashboard() {
  const { students, isLoading, deleteStudent } = useStudents();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [deleteConfirmStudent, setDeleteConfirmStudent] = useState<Student | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStudents = students.filter(student =>
    student.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.course_or_department?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddStudent = () => {
    setSelectedStudent(null);
    setIsModalOpen(true);
  };

  const handleEditStudent = (student: Student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleDeleteStudent = (student: Student) => {
    setDeleteConfirmStudent(student);
  };

  const confirmDelete = async () => {
    if (deleteConfirmStudent) {
      await deleteStudent.mutateAsync(deleteConfirmStudent.id);
      setDeleteConfirmStudent(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="gradient-primary rounded-2xl p-8 shadow-glow">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold font-display text-primary-foreground mb-2">
                  Student Management Dashboard
                </h1>
                <p className="text-primary-foreground/80">
                  Manage student records securely and efficiently
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-primary-foreground/10 rounded-xl">
                  <Users className="w-5 h-5 text-primary-foreground" />
                  <span className="font-semibold text-primary-foreground">{students.length}</span>
                  <span className="text-primary-foreground/80">Students</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Actions Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-4 mb-6"
        >
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search students by name, email, or department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-input bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            />
          </div>
          <GradientButton onClick={handleAddStudent} size="lg" className="gap-2">
            <Plus className="w-4 h-4" />
            Add Student
          </GradientButton>
        </motion.div>

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <p className="text-muted-foreground">Loading students...</p>
            </div>
          </div>
        ) : filteredStudents.length === 0 ? (
          searchQuery ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <p className="text-muted-foreground">No students found matching "{searchQuery}"</p>
            </motion.div>
          ) : (
            <EmptyState onAddStudent={handleAddStudent} />
          )
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {filteredStudents.map((student, index) => (
              <StudentCard
                key={student.id}
                student={student}
                onEdit={handleEditStudent}
                onDelete={handleDeleteStudent}
                index={index}
              />
            ))}
          </motion.div>
        )}
      </main>

      {/* Modals */}
      <StudentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedStudent(null);
        }}
        student={selectedStudent}
      />

      <DeleteConfirmDialog
        isOpen={!!deleteConfirmStudent}
        onClose={() => setDeleteConfirmStudent(null)}
        onConfirm={confirmDelete}
        studentName={deleteConfirmStudent?.full_name || ''}
        isDeleting={deleteStudent.isPending}
      />
    </div>
  );
}
