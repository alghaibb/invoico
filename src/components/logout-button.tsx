"use client";

import { logout } from "@/actions/auth/logout";

interface LogoutButtonProps {
  children?: React.ReactNode;
  className?: string;
}

export const LogoutButton = ({ children, className }: LogoutButtonProps) => {
  const onClick = () => {
    logout();
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
