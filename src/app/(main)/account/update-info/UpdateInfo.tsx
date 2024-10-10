"use client";

import { Plan, User } from "@prisma/client";
import { useEffect, useState } from "react";

import { LoadingDots } from "@/components/loading";
import PasswordUpdateForm from "@/components/password-update-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function UpdateInfo() {
  const [user, setUser] = useState<(User & { Plan: Plan | null }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/user/get-user");
        const data = await response.json();
        setUser(data.user);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <LoadingDots />;
  }

  if (!user) {
    return <div>User not found</div>;
  }

  const togglePasswordFormVisibility = () =>
    setShowPasswordForm(!showPasswordForm);

  return (
    <div className="space-y-6">
      {/* First Name */}
      <div className="grid gap-2">
        <Label htmlFor="firstName">First Name</Label>
        <Input
          id="firstName"
          placeholder={user.firstName || "First Name"}
          defaultValue={user.firstName || ""}
        />
      </div>

      {/* Last Name */}
      <div className="grid gap-2">
        <Label htmlFor="lastName">Last Name</Label>
        <Input
          id="lastName"
          placeholder={user.lastName || "Last Name"}
          defaultValue={user.lastName || ""}
        />
      </div>

      {/* Email */}
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder={user.email || "Your email address"}
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
