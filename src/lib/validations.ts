import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().trim().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export const signupSchema = z.object({
  fullName: z.string().trim().min(2, { message: "Full name must be at least 2 characters" }),
  email: z.string().trim().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email({ message: "Please enter a valid email address" }),
});

export const resetPasswordSchema = z.object({
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const studentSchema = z.object({
  full_name: z.string().trim().min(2, { message: "Full name is required" }).max(100, { message: "Name too long" }),
  email: z.string().trim().email({ message: "Please enter a valid email" }),
  phone: z.string().optional().refine((val) => !val || /^[\d\s\-+()]{7,20}$/.test(val), {
    message: "Please enter a valid phone number",
  }),
  date_of_birth: z.string().optional(),
  gender: z.string().optional(),
  course_or_department: z.string().optional(),
  batch_or_year: z.string().optional(),
  address: z.string().max(500, { message: "Address too long" }).optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type StudentFormData = z.infer<typeof studentSchema>;
