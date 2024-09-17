import React, { useState } from "react";
import { Button } from "./ui/button";
import { facebookLogin, googleLogin } from "@/actions/auth/social-login";
import { LoadingDots } from "./ui/loading";

interface SocialLoginButtonProps {
  provider: "google" | "facebook";
  label: string;
  icon?: React.ReactNode;
  className?: string;
  type?: "button" | "submit" | "reset";
}

const SocialLoginButton: React.FC<SocialLoginButtonProps> = ({
  provider,
  label,
  icon,
  className,
  type
}) => {
  const [isSocialLogin, setIsSocialLogin] = useState(false);

  const handleLogin = async () => {
    setIsSocialLogin(true); // Set loading state to true
    try {
      if (provider === "facebook") {
        await facebookLogin();
      } else if (provider === "google") {
        await googleLogin();
      }
    } catch (error) {
      console.error("Social login failed:", error);
    } finally {
      setIsSocialLogin(false); // Reset loading state after login attempt
    }
  };

  return (
    <Button
      onClick={handleLogin}
      disabled={isSocialLogin}
      className={`flex items-center justify-center w-full space-x-2 ${className}`}
      variant="outline"
      type={type}
    >
      {isSocialLogin ? (
        <LoadingDots />
      ) : (
        <>
          {icon && <span className="mr-2">{icon}</span>}{" "}
          {/* Proper spacing for the icon */}
          <span>{label}</span>
        </>
      )}
    </Button>
  );
};

export default SocialLoginButton;
