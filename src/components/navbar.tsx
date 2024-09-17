import React from "react";
import Link from "next/link";
import Image from "next/image";
import { getSession } from "@/utils/session";
import { navbarLinks } from "@/constants";
import NavbarButtons from "./navbar-buttons";
import { Button } from "./ui/button";

const Navbar = async () => {
  const session = await getSession();

  return (
    <nav className="w-full px-6 py-4 shadow-md flex justify-between items-center">
      <Link href="/">
        <Image
          src="/logo-no-background.svg"
          alt="Invoice logo"
          width={100}
          height={100}
        />
      </Link>

      <div className="hidden md:flex space-x-4">
        {navbarLinks.map((link) => (
          <Link key={link.href} href={link.href}>
            <Button variant="link">{link.label}</Button>
          </Link>
        ))}
      </div>

      <NavbarButtons isAuthenticated={!!session?.userId} />
    </nav>
  );
};

export default Navbar;
