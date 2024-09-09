"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { resetPassword } from "@/actions/auth/reset-password"; // Import your resetPassword action
import { useAction } from "next-safe-action/hooks";
import { ResetPasswordSchema } from "@/schemas/auth";
import { Eye, EyeOff } from "lucide-react";
import { LoadingDots } from "@/components/ui/loading";
import { useRouter, useSearchParams } from "next/navigation"; // Import `useSearchParams`
import { Message } from "@/components/ui/custom-message";
import CardWrapper from "@/components/card-wrapper";

// Define types based on Zod schema
type ResetPasswordFormData = z.infer<typeof ResetPasswordSchema>;

const ResetPasswordForm: React.FC = () => {
  const { execute, result, isExecuting } = useAction(resetPassword);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const router = useRouter();
  const searchParams = useSearchParams(); // Hook to access query params

  // Fetch the token from the URL query params
  const token = searchParams.get("token");

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
      token: token || "", 
    },
  });

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const onSubmit = async (data: ResetPasswordFormData) => {
    setError(null); // Reset error message
    execute(data);
  };

  useEffect(() => {
    if (result?.data?.success) {
      router.push("/login"); // Redirect user after successful password reset
    } else if (result?.data?.error) {
      setError(result.data.error); // Set error message if there's any
    }
  }, [result, form, router]);

  return (
    <CardWrapper
      label="Please enter your new password to reset"
      title="Reset Your Password"
      backButtonHref="/login"
      backButtonLabel="Back to Login"
    >
      {error && <Message type="error" message={error} />}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-4"
        >
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      type={showPassword ? "text" : "password"}
                      {...field}
                      disabled={isExecuting}
                    />
                  </FormControl>
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-2 top-3"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm New Password</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      {...field}
                      disabled={isExecuting}
                    />
                  </FormControl>
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className="absolute right-2 top-3"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="relative flex items-center justify-center">
            <Button type="submit" disabled={isExecuting} className="w-full">
              {isExecuting ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <LoadingDots />
                </div>
              ) : (
                "Reset Password"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default ResetPasswordForm;
