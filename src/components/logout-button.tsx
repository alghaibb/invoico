"use client";

import { useRouter } from "next/navigation";

import { logout } from "@/actions/auth/logout";

interface LogoutButtonProps {
  children?: React.ReactNode;
  className?: string;
}

export const LogoutButton = ({ children, className }: LogoutButtonProps) => {
  const router = useRouter();

  const onClick = async () => {
    await logout();
    router.push("/login");
    window.location.href = "/login";
  };

  return (
    <span
      onClick={onClick}
      className={`cursor-pointer text-muted ${className}`}
    >
      {children}
    </span>
  );
};
