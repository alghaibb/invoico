import { ClipboardList, Mail, UserCircle } from "lucide-react";
import { Metadata } from "next";
import { redirect } from "next/navigation";

import { Separator } from "@/components/ui/separator";
import { getUserFromSession } from "@/utils/session";

export const metadata: Metadata = {
  title: "My Account",
};

export default async function AccountPage() {
  const user = await getUserFromSession();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-full max-w-3xl p-6 space-y-8 bg-white rounded-lg shadow-md">
        {/* Page Title */}
        <div className="flex flex-col items-center md:flex-row md:space-x-4">
          <UserCircle className="hidden w-10 h-10 md:block text-foreground" />
          <h1 className="text-3xl font-bold text-center md:text-4xl text-foreground">
            Account Overview
          </h1>
        </div>

        {/* Welcome Message */}
        <p className="text-base md:text-lg text-muted-foreground">
          Welcome back,{" "}
          <span className="font-medium text-foreground">{user.name}</span>!
        </p>

        {/* Account Info */}
        <div className="space-y-4">
          <p className="text-sm md:text-base text-muted-foreground">
            Here you can manage your personal information and view your account
            plan. Use the side navigation to explore all your account details.
          </p>

          <Separator className="my-6" />

          {/* Email */}
          <div className="flex items-center md:space-x-2">
            <Mail className="hidden w-5 h-5 md:block text-foreground" />
            <p className="text-sm md:text-base text-muted-foreground">
              Email:{" "}
              <span className="font-medium text-foreground">{user.email}</span>
            </p>
          </div>

          <Separator />

          {/* Plan Details */}
          <div className="mt-4">
            <div className="flex items-center md:space-x-2">
              <ClipboardList className="hidden w-5 h-5 md:block text-foreground" />
              <h2 className="text-lg font-semibold underline text-foreground underline-offset-4">
                Plan Details
              </h2>
            </div>
            <div className="mt-2 space-y-2 text-sm">
              <p className="text-foreground">
                <span className="font-medium">Plan Type:</span>{" "}
                {user?.planType || "Free"}
              </p>
              <p className="text-foreground">
                <span className="font-medium">Plan ID:</span>{" "}
                {user?.planId || "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
