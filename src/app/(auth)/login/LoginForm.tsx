"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import React, { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { FaFacebook, FaGoogle } from "react-icons/fa6";
import { z } from "zod";

import { login } from "@/actions/auth/login";
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
import { LoginSchema } from "@/validations/auth";

// Define types based on Zod schema
type LoginFormData = z.infer<typeof LoginSchema>;

const LoginForm: React.FC = () => {
  const { execute, result, isExecuting } = useAction(login);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const router = useRouter();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const togglePasswordVisibility = useCallback(
    () => setShowPassword((prev) => !prev),
    []
  );

  const onSubmit = async (data: LoginFormData) => {
    setError(null); // Reset error message
    execute(data);
  };

  // Redirect on successful login
  useEffect(() => {
    if (result?.data?.success) {
      router.push("/invoices");
      window.location.href = "/invoices";
    } else if (result?.data?.error) {
      setError(result.data.error); // Set error message if there's any
    }
  }, [result, router]);

  return (
    <CardWrapper
      label="Enter your credentials to login"
      title="Login to Your Account"
      backButtonHref="/create-account"
      backButtonLabel="Don't have an account?"
    >
      {error && <Message type="error" message={error} />}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-4"
        >
          {/* Email */}
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
          {/* Password */}
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
          <Link href="/forgot-password">
            <Button className="px-0 mt-2" variant="link" type="button">
              Forgot your password?
            </Button>
          </Link>

          {/* Social Buttons */}
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
            <SocialLoginButton
              provider="google"
              label="Sign in with Google"
              icon={<FaGoogle className="w-4 h-4 " />}
              type="button"
            />
            <SocialLoginButton
              provider="facebook"
              label="Sign in with Facebook"
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
                "Login"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default LoginForm;
