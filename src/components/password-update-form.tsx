"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { updatePassword } from "@/actions/account/update-password";
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
import { useToast } from "@/hooks/use-toast";
import { UpdatePasswordSchema } from "@/validations/auth";

import { LoadingDots } from "./loading";

// Define the form schema using Zod
type ResetPasswordFormData = z.infer<typeof UpdatePasswordSchema>;

const PasswordUpdateForm: React.FC<{ onCancel: () => void }> = ({
  onCancel,
}) => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { execute, result, isExecuting } = useAction(updatePassword);
  const { toast } = useToast();

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(UpdatePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const toggleCurrentPasswordVisibility = () =>
    setShowCurrentPassword(!showCurrentPassword);

  const toggleNewPasswordVisibility = () =>
    setShowNewPassword(!showNewPassword);

  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const onSubmit = async (data: ResetPasswordFormData) => {
    execute(data);
  };

  useEffect(() => {
    if (result?.data?.success) {
      toast({
        title: "Password updated successfully",
        description: result.data.success,
      });
      onCancel();
    } else if (result?.data?.error) {
      toast({
        title: "Failed to update password",
        description: result.data.error,
        variant: "destructive",
      });
    }
  }, [result, toast, onCancel]);

  return (
    <div className="mt-4 transition-all duration-300 ease-in-out">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Current Password Field */}
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showCurrentPassword ? "text" : "password"}
                      {...field}
                      placeholder="Enter current password"
                      disabled={isExecuting}
                    />
                    <button
                      type="button"
                      onClick={toggleCurrentPasswordVisibility}
                      className="absolute right-2 top-2.5"
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* New Password Field */}
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      type={showNewPassword ? "text" : "password"}
                      {...field}
                      placeholder="Enter new password"
                      disabled={isExecuting}
                    />
                  </FormControl>
                  <button
                    type="button"
                    onClick={toggleNewPasswordVisibility}
                    className="absolute right-2 top-2.5"
                  >
                    {showNewPassword ? (
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

          {/* Confirm Password Field */}
          <FormField
            control={form.control}
            name="confirmNewPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm New Password</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      {...field}
                      placeholder="Confirm new password"
                      disabled={isExecuting}
                    />
                  </FormControl>
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className="absolute right-2 top-2.5"
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

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button type="submit">
              {isExecuting ? <LoadingDots /> : "Update Password"}
            </Button>
            <Button variant="link" onClick={onCancel} className="ml-2">
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default PasswordUpdateForm;
