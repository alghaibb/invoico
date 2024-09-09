import { Metadata } from "next";
import LoginPage from "./LoginPage";

export const metadata: Metadata = {
  title: "Login",
};

export default async function Page() {
  return <LoginPage />;
}
