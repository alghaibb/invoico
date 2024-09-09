import ResetPasswordForm from "./ResetPasswordForm";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const ResetPasswordPage = () => {
  return (
    <Suspense fallback={<Skeleton className="w-full h-full" />}>
      <ResetPasswordForm />
    </Suspense>
  );
};

export default ResetPasswordPage;
