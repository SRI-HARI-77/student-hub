import { AuthLayout } from '@/components/auth/AuthLayout';
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';

export default function ResetPassword() {
  return (
    <AuthLayout 
      title="Set New Password" 
      subtitle="Enter your new password below"
    >
      <ResetPasswordForm />
    </AuthLayout>
  );
}
