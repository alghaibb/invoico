import { Metadata } from "next";
import { Suspense } from "react";

import { LoadingDots } from "@/components/loading";

import ResetPasswordPage from "./ResetPasswordPage";

export const metadata: Metadata = {
  title: "Reset Password",
};

export default function Page() {
  return (
    <Suspense
      fallback={
        <LoadingDots className="h-full flex items-center justify-center" />
      }
    >
      <ResetPasswordPage />
    </Suspense>
  );
}
