import { ClipboardList, Mail, UserCircle } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
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
    <div className="flex flex-col items-center min-h-screen p-6 space-y-6 bg-muted">
      <div className="w-full max-w-4xl p-6 space-y-6 bg-white rounded-lg shadow-md">
        {/* Page Title */}
        <div className="flex items-center justify-center space-x-4 md:justify-start">
          <UserCircle className="hidden w-10 h-10 md:block text-foreground" />
          <h1 className="text-3xl font-bold text-center text-foreground md:text-4xl">
            Account Overview
          </h1>
        </div>

        {/* Welcome Message */}
        <p className="text-base md:text-lg text-muted-foreground">
          Welcome back,{" "}
          <span className="font-medium text-primary">{user.firstName}</span>!
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
              <h2 className="text-lg font-semibold text-foreground">
                Plan Details
              </h2>
            </div>
            <div className="mt-2 space-y-2 text-sm">
              <p className="text-foreground">
                <span className="font-medium">Plan Type:</span>{" "}
                {user?.Plan?.type || "Free"}
              </p>
              <p className="text-foreground">
                <span className="font-medium">Plan ID:</span>{" "}
                {user?.planId || "N/A"}
              </p>
            </div>
            <Button asChild className="w-full mt-4 md:w-auto">
              <Link href="/upgrade-plan">Upgrade Plan</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
