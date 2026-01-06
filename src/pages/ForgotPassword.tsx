import { AuthLayout } from '@/components/auth/AuthLayout';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';

export default function ForgotPassword() {
  return (
    <AuthLayout 
      title="Reset Password" 
      subtitle="Reset your password securely"
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
