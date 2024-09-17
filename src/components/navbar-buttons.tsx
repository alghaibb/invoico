import Link from "next/link";
import { Button } from "./ui/button";
import { LogoutButton } from "./logout-button";
import { LogOutIcon } from "lucide-react";
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
          <Link href="/account" className="w-full">
            {" "}
            {/* Make full-width */}
            <Button className="w-full">Account</Button>
          </Link>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="w-full">
                  {" "}
                  {/* Make full-width */}
                  <LogoutButton>
                    <LogOutIcon />
                  </LogoutButton>
                </span>
              </TooltipTrigger>
              <TooltipContent side="top" align="end">
                Logout
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </>
      ) : (
        <>
          <Link href="/login" className="w-full">
            {" "}
            {/* Make full-width */}
            <Button variant="outline" className="w-full">
              Login
            </Button>
          </Link>
          <Link href="/create-account" className="w-full">
            {" "}
            {/* Make full-width */}
            <Button className="w-full">Create Account</Button>
          </Link>
        </>
      )}
    </div>
  );
};

export default NavbarButtons;
