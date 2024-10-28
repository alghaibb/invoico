import { LogOutIcon } from "lucide-react";
import Link from "next/link";

import { LogoutButton } from "./logout-button";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "./ui/tooltip";

interface NavbarButtonsProps {
  isAuthenticated: boolean; // True if user is logged in
  className?: string; // For custom class to allow full-width on mobile
}

const NavbarButtons: React.FC<NavbarButtonsProps> = ({
  isAuthenticated,
  className,
}) => {
  return (
    <div className={`flex space-x-4 items-center justify-center ${className}`}>
      {isAuthenticated ? (
        <>
          <Link href="/account">
            <Button>Account</Button>
          </Link>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <LogoutButton>
                    <LogOutIcon className="text-primary" />
                  </LogoutButton>
                </span>
              </TooltipTrigger>
              <TooltipContent side="top" align="end">
                Log Out
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </>
      ) : (
        <>
          <Link href="/login">
            <Button variant="ghost" className="text-secondary">
              Log In
            </Button>
          </Link>
          <Link href="/create-account">
            <Button variant="navbar">Create An Account</Button>
          </Link>
        </>
      )}
    </div>
  );
};

export default NavbarButtons;
