import { z } from "zod";

// -------------------- COMMON VALIDATIONS --------------------

// Email validation
const emailValidation = z.string().email({ message: "Invalid email address" });

// Password validation
const passwordValidation = z
  .string()
  .min(8, { message: "Password must be at least 8 characters long" })
  .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
  .regex(/[0-9]/, { message: "Password must contain at least one number" })
  .regex(/[@$!%*?&#]/, { message: "Password must contain at least one special character" });

// Confirm password validation (reused in schemas where necessary)
const confirmPasswordValidation = z
  .string()
  .min(8, { message: "Confirm password must be at least 8 characters long" });

// -------------------- SCHEMA DEFINITIONS --------------------

// Create Account Schema
export const CreateAccountSchema = z
  .object({
    firstName: z
      .string()
      .min(2, { message: "First name must be at least 2 characters long" }),
    lastName: z
      .string()
      .min(2, { message: "Last name must be at least 2 characters long" }),
    email: emailValidation,
    password: passwordValidation,
    confirmPassword: confirmPasswordValidation,
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

// Verify Email Schema
export const VerifyEmailSchema = z.object({
  otp: z
    .string()
    .length(6, { message: "OTP must be exactly 6 digits" })
    .regex(/^\d+$/, { message: "OTP must be numeric" }),
});

// Resend Verification Email Schema
export const ResendVerificationEmailSchema = z.object({
  email: emailValidation,
});

// Login Schema
export const LoginSchema = z.object({
  email: emailValidation,
  password: passwordValidation,
});

// Forgot Password Schema
export const ForgotPasswordSchema = z.object({
  email: emailValidation,
});

// Reset Password Schema
export const ResetPasswordSchema = z
  .object({
    token: z.string(),
    password: passwordValidation,
    confirmPassword: confirmPasswordValidation,
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

// Update Password Schema
export const UpdatePasswordSchema = z.object({
  currentPassword: z.string(),
  newPassword: passwordValidation,
  confirmNewPassword: confirmPasswordValidation,
});
