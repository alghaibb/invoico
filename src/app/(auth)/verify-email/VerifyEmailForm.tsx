"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { verifyEmail } from "@/actions/auth/verify-email";
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
import {
  InputOTP,
  InputOTPSlot,
  InputOTPGroup,
  InputOTPSeparator,
} from "@/components/ui/input-otp";
import { VerifyEmailSchema } from "@/validations/auth";

// Define types based on Zod schema
type VerifyEmailFormData = z.infer<typeof VerifyEmailSchema>;

const VerifyEmailForm: React.FC = () => {
  const { execute, result, isExecuting } = useAction(verifyEmail);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<VerifyEmailFormData>({
    resolver: zodResolver(VerifyEmailSchema),
    defaultValues: {
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
      label="Enter the OTP sent to your email to verify your account"
      title="Verify Your Email"
      backButtonHref=""
      backButtonLabel=""
    >
      {error && <Message type="error" message={error} />}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem className="flex flex-col justify-center items-center gap-4">
                <FormLabel>OTP</FormLabel>
                <FormControl>
                  <InputOTP {...field} maxLength={6} className="space-x-2">
                    <InputOTPGroup>
                      <InputOTPSlot index={0} className="w-10 h-12" />
                      <InputOTPSlot index={1} className="w-10 h-12" />
                      <InputOTPSlot index={2} className="w-10 h-12" />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={3} className="w-10 h-12" />
                      <InputOTPSlot index={4} className="w-10 h-12" />
                      <InputOTPSlot index={5} className="w-10 h-12" />
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
