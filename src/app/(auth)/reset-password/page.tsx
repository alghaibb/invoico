import { Metadata } from "next";
import ResetPasswordPage from "./ResetPasswordPage";
import { Suspense } from "react";
import { LoadingDots } from "@/components/loading";

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
