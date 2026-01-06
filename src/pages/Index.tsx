import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';
import { GraduationCap, ArrowRight, Shield, Database, Users } from 'lucide-react';
import { GradientButton } from '@/components/ui/GradientButton';

const features = [
  {
    icon: Shield,
    title: 'Secure Authentication',
    description: 'Role-based access control for authorized staff only',
  },
  {
    icon: Database,
    title: 'Real Database',
    description: 'Persistent storage with real-time updates',
  },
  {
    icon: Users,
    title: 'Student Management',
    description: 'Complete CRUD operations for student records',
  },
];

export default function Index() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen gradient-subtle">
      {/* Header */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shadow-glow-sm">
              <GraduationCap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold font-display gradient-text">StudentHub</span>
          </div>
          <div className="flex items-center gap-3">
            <GradientButton variant="ghost" onClick={() => navigate('/login')}>
              Sign In
            </GradientButton>
            <GradientButton onClick={() => navigate('/signup')} className="hidden sm:flex">
              Get Started
            </GradientButton>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Shield className="w-4 h-4" />
              Secure Student Management System
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold font-display text-foreground mb-6"
          >
            Student Management{' '}
            <span className="gradient-text">Dashboard</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            Manage student records securely and efficiently. A complete solution for 
            authorized staff to handle student data with real-time database operations.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <GradientButton size="lg" onClick={() => navigate('/signup')} className="gap-2">
              Create Authority Account
              <ArrowRight className="w-4 h-4" />
            </GradientButton>
            <GradientButton size="lg" variant="outline" onClick={() => navigate('/login')}>
              Authority Login
            </GradientButton>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
              className="glass-card rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300"
            >
              <div className="w-14 h-14 gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4 shadow-glow-sm">
                <feature.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-bold font-display text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-semibold font-display gradient-text">StudentHub</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 StudentHub. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
