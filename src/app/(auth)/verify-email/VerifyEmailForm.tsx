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
import { verifyEmail } from "@/actions/auth/verify-email";
import { useAction } from "next-safe-action/hooks";
import { VerifyEmailSchema } from "@/schemas/auth";
import { LoadingDots } from "@/components/ui/loading";
import { useRouter } from "next/navigation";
import CardWrapper from "@/components/card-wrapper";
import { Message } from "@/components/ui/custom-message";
import {
  InputOTP,
  InputOTPSlot,
  InputOTPGroup,
  InputOTPSeparator,
} from "@/components/ui/input-otp";

// Define types based on Zod schema
type VerifyEmailFormData = z.infer<typeof VerifyEmailSchema>;

const VerifyEmailForm: React.FC = () => {
  const { execute, result, isExecuting } = useAction(verifyEmail);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<VerifyEmailFormData>({
    resolver: zodResolver(VerifyEmailSchema),
    defaultValues: {
      email: "", // User manually inputs the email
      otp: "",
    },
  });

  const onSubmit = async (data: VerifyEmailFormData) => {
    setError(null); // Reset error message
    execute(data);
  };

  // Handle successful email verification
  useEffect(() => {
    if (result?.data?.success) {
      router.push("/login"); // Redirect to your dashboard page or another protected route
    } else if (result?.data?.error) {
      setError(result.data.error); // Set error message if there's any
    }
  }, [result, router]);

  return (
    <CardWrapper
      label="Enter your email and OTP to verify"
      title="Verify Your Email"
      backButtonHref=""
      backButtonLabel=""
    >
      {error && <Message type="error" message={error} />}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>OTP</FormLabel>
                <FormControl>
                  <InputOTP {...field} maxLength={6}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
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
                "Verify Email"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default VerifyEmailForm;
