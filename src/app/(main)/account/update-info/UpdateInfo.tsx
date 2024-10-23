// src/components/UpdateInfo.tsx

"use client";

import { Plan, User } from "@prisma/client";
import { useState } from "react";

import PasswordUpdateForm from "@/components/password-update-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type UpdateInfoProps = {
  user: User & { Plan: Plan | null };
};

export default function UpdateInfo({ user }: UpdateInfoProps) {
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const togglePasswordFormVisibility = () =>
    setShowPasswordForm(!showPasswordForm);

  return (
    <div className="space-y-6">
      {/* First Name */}
      <div className="grid gap-2">
        <Label htmlFor="firstName">First Name</Label>
        <Input
          id="firstName"
          placeholder="First Name"
          defaultValue={user.firstName ?? ""} 
        />
      </div>

      {/* Last Name */}
      <div className="grid gap-2">
        <Label htmlFor="lastName">Last Name</Label>
        <Input
          id="lastName"
          placeholder="Last Name"
          defaultValue={user.lastName ?? ""} 
        />
      </div>

      {/* Email */}
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Your email address"
          defaultValue={user.email}
          readOnly
          disabled
        />
      </div>

      {/* Update Password Button */}
      {!showPasswordForm && (
        <Button
          variant="link"
          onClick={togglePasswordFormVisibility}
          className="px-1"
        >
          Update Password
        </Button>
      )}

      {/* Password Update Form */}
      {showPasswordForm && (
        <PasswordUpdateForm onCancel={togglePasswordFormVisibility} />
      )}
    </div>
  );
}
