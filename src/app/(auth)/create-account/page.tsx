import { Metadata } from "next";
import CreateAccountPage from "./CreateAccountPage";

export const metadata: Metadata = {
  title: "Create Account",
};

export default async function Page() {
  return <CreateAccountPage />;
}
