import { Metadata } from "next";
import { redirect } from "next/navigation";
import { RxUpdate } from "react-icons/rx";

import { getUserFromSession } from "@/utils/session";

import UpdateInfo from "./UpdateInfo";

export const metadata: Metadata = {
  title: "Update Info | My Account",
};

export default async function UpdateInfoPage() {
  const user = await getUserFromSession();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="w-full max-w-2xl p-6 mx-auto space-y-10 rounded-md shadow-lg md:p-8 md:space-y-6">
      {/* Page Title */}
      <div className="flex items-center justify-center space-x-4 md:justify-start">
        <RxUpdate className="hidden w-8 h-8 text-foreground md:block" />
        <h1 className="text-3xl font-bold text-center text-foreground md:text-4xl md:text-left">
          Update Account Information
        </h1>
      </div>
      {/* Content */}
      <UpdateInfo />
    </div>
  );
}
