import React from "react";
import Link from "next/link";
import Image from "next/image";
import { getSession } from "@/utils/session";
import { navbarLinks } from "@/constants";
import NavbarButtons from "../navbar-buttons";
import { Button } from "../ui/button";
import MobileNav from "./MobileNav";

const Navbar = async () => {
  const session = await getSession();

  return (
    <nav className="fixed top-0 right-0 z-50 flex items-center justify-between w-full px-6 py-4 bg-white shadow-md">
      {/* Logo */}
      <Link href="/">
        <Image
          src="/logo-no-background.svg"
          alt="Invoice logo"
          width={100}
          height={100}
          className=""
        />
      </Link>

      {/* Desktop Links */}
      <div className="hidden space-x-4 md:flex">
        {navbarLinks.map((link) => (
          <Link key={link.href} href={link.href}>
            <Button variant="link">{link.label}</Button>
          </Link>
        ))}
      </div>

      {/* Desktop Navbar Buttons */}
      <div className="hidden md:flex">
        <NavbarButtons isAuthenticated={!!session?.userId} />
      </div>

      {/* Mobile Navbar */}
      <div className="md:hidden">
        <MobileNav />
      </div>
    </nav>
  );
};

export default Navbar;
