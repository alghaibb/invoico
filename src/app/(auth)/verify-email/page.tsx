import { Metadata } from "next";
import VerifyEmailPage from "./VerifyEmailPage";

export const metadata: Metadata = {
  title: "Verify Email",
};

export default async function Page() {
  return <VerifyEmailPage />;
}
