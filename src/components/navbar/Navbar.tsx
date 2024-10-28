import Image from "next/image";
import Link from "next/link";
import React from "react";

import { navbarLinks } from "@/constants";
import { getSession } from "@/utils/session";

import MobileNav from "./MobileNav";
import NavbarButtons from "../navbar-buttons";
import { Button } from "../ui/button";

const Navbar = async () => {
  const session = await getSession();

  return (
    <nav className="fixed top-0 right-0 z-50 flex items-center justify-between w-full px-6 py-4 bg-white border-b md:px-8 md:py-6">
      {/* Logo */}
      <Link href="/">
        <Image
          src="/logo-no-background.svg"
          alt="Invoice logo"
          width={100}
          height={100}
          priority
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
