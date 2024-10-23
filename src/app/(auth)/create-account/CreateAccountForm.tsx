"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import React, { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { FaFacebook, FaGoogle } from "react-icons/fa6";
import { z } from "zod";

import { createAccount } from "@/actions/auth/create-account";
import CardWrapper from "@/components/card-wrapper";
import { Message } from "@/components/custom-message";
import { LoadingDots } from "@/components/loading";
import SocialLoginButton from "@/components/social-login-button";
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
import { CreateAccountSchema } from "@/validations/auth";

// Define types based on Zod schema
type CreateAccountFormData = z.infer<typeof CreateAccountSchema>;

const CreateAccountForm: React.FC = () => {
  const { execute, result, isExecuting } = useAction(createAccount);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const router = useRouter();

  const form = useForm<CreateAccountFormData>({
    resolver: zodResolver(CreateAccountSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const togglePasswordVisibility = useCallback(
    () => setShowPassword((prev) => !prev),
    [],
  );
  const toggleConfirmPasswordVisibility = useCallback(
    () => setShowConfirmPassword((prev) => !prev),
    [],
  );

  const onSubmit = useCallback(
    async (data: CreateAccountFormData) => {
      setError(null); // Reset error message
      execute(data);
    },
    [execute],
  );

  // Redirect to verify-email page on successful account creation
  useEffect(() => {
    if (result?.data?.success) {
      // Redirect user to /verify-email
      router.push("/verify-email");
    } else if (result?.data?.error) {
      setError(result.data.error); // Set error message if there's any
    }
  }, [result, router]);

  return (
    <CardWrapper
      label="Please enter your details to create an account"
      title="Create Your Account"
      backButtonHref="/login"
      backButtonLabel="Have an account?"
    >
      {error && <Message type="error" message={error} />}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-4"
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isExecuting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isExecuting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
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
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
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
                <FormLabel>Confirm Password</FormLabel>
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

          {/* Social Buttons */}
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
            <SocialLoginButton
              provider="google"
              label="Sigup with Google"
              icon={<FaGoogle className="w-4 h-4 " />}
              type="button"
            />
            <SocialLoginButton
              provider="facebook"
              label="Sigup with Facebook"
              icon={<FaFacebook className="w-4 h-4" />}
              type="button"
            />
          </div>

          <div className="relative flex items-center justify-center">
            <Button type="submit" disabled={isExecuting} className="w-full">
              {isExecuting ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <LoadingDots />
                </div>
              ) : (
                "Create Account"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default CreateAccountForm;
