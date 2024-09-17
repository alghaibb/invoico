"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { navbarLinks } from "@/constants";
import { useSession } from "next-auth/react";
import { X } from "lucide-react";
import { RxHamburgerMenu } from "react-icons/rx";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "../logout-button";

import styles from "@/styles/mobileNav.module.css";

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data } = useSession();
  const session = data?.user;

  // Toggle the mobile menu
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Close the menu when the user clicks on a link
  const closeMenu = () => {
    setIsOpen(false);
  };

  // Disable scrolling when the menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto"; // Cleanup
    };
  }, [isOpen]);

  return (
    <>
      {/* Hamburger Menu Button */}
      <button onClick={toggleMenu} aria-label="Open Menu">
        <RxHamburgerMenu className="w-7 h-7" />
      </button>

      {/* Mobile Menu */}
      <div className={`${styles["mobile-menu"]} ${isOpen ? styles.open : ""}`}>
        {/* Close Button */}
        <button onClick={toggleMenu} className="absolute top-8 right-5 z-50">
          <X className="w-7 h-7" />
        </button>

        {/* Menu Links */}
        <div className={styles["menu-links"]}>
          {navbarLinks.map((link, index) => (
            <Link key={index} href={link.href} onClick={closeMenu}>
              <Button variant="link">{link.label}</Button>
            </Link>
          ))}

          {/* Login/User Button */}
          {session ? (
            <LogoutButton className="w-full">
              <Button className="w-full">Logout</Button>
            </LogoutButton>
          ) : (
            <div className="flex flex-col space-y-1 w-full" onClick={closeMenu}>
              <Link href="/login">
                <Button variant="outline" className="w-full">
                  Login
                </Button>
              </Link>
              <Link href="/create-account">
                <Button className="w-full">Create Account</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MobileNav;
