import Link from "next/link";
import { Button } from "./ui/button";
import { LogoutButton } from "./logout-button";

interface NavbarButtonsProps {
  isAuthenticated: boolean; // True if user is logged in
}

const NavbarButtons: React.FC<NavbarButtonsProps> = ({ isAuthenticated }) => {
  return (
    <div className="flex space-x-4">
      {isAuthenticated ? (
        <>
          <Link href="/account">
            <Button>Account</Button>
          </Link>
          <LogoutButton>Logout</LogoutButton>
        </>
      ) : (
        <>
          <Link href="/login">
            <Button variant="outline">Login</Button>
          </Link>
          <Link href="/create-account">
            <Button>Create Account</Button>
          </Link>
        </>
      )}
    </div>
  );
};

export default NavbarButtons;
