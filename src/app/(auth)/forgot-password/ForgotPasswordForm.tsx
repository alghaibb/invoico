"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { forgotPassword } from "@/actions/auth/forgot-password";
import CardWrapper from "@/components/card-wrapper";
import { Message } from "@/components/custom-message";
import { LoadingDots } from "@/components/loading";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ForgotPasswordSchema } from "@/validations/auth";

// Define types based on Zod schema
type ForgotPasswordFormData = z.infer<typeof ForgotPasswordSchema>;

const ForgotPasswordForm: React.FC = () => {
  const { execute, result, isExecuting } = useAction(forgotPassword);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setError(null); // Reset error message
    setSuccessMessage(null); // Reset success message
    execute(data);
  };

  useEffect(() => {
    if (result?.data?.success) {
      setSuccessMessage(result.data.message);
      form.reset(); // Reset form fields
    } else if (result?.data?.error) {
      setError(result.data.error); // Set error message if there's any
    }
  }, [form, result]);

  return (
    <CardWrapper
      label="Forgot your password?"
      title="Reset Your Password"
      backButtonHref="/login"
      backButtonLabel="Remember your password?"
    >
      {error && <Message type="error" message={error} />}
      {successMessage && <Message type="success" message={successMessage} />}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-4"
        >
          {/* Email Input */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isExecuting} />
                </FormControl>
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
                "Send Reset Link"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default ForgotPasswordForm;
