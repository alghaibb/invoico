import { Metadata } from "next";
import ForgotPasswordPage from "./ForgotPasswordPage";

export const metadata: Metadata = {
  title: "Forgot Password",
};

export default async function Page() {
  return <ForgotPasswordPage />;
}
