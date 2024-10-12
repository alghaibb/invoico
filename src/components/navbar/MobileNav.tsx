"use client";

import { X } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import React, { useState, useEffect } from "react";
import { RxHamburgerMenu } from "react-icons/rx";

import { Button } from "@/components/ui/button";
import { navbarLinks } from "@/constants";
import styles from "@/styles/mobileNav.module.css";

import { LogoutButton } from "../logout-button";

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data } = useSession();
  const session = data?.user;

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

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
      <button onClick={toggleMenu} aria-label="Open Menu">
        <RxHamburgerMenu className="w-7 h-7 text-secondary" />
      </button>

      <div className={`${styles["mobile-menu"]} ${isOpen ? styles.open : ""}`}>
        <button onClick={toggleMenu} className="absolute z-50 top-8 right-5">
          <X className="w-7 h-7" />
        </button>

        <div className={styles["menu-links"]}>
          {navbarLinks.map((link, index) => (
            <Link key={index} href={link.href} onClick={closeMenu}>
              <Button variant="link">{link.label}</Button>
            </Link>
          ))}

          {/* Login/User Button */}
          {session ? (
            <div className="flex flex-col w-full ">
              <Link href="/account" onClick={closeMenu}>
                <Button variant="outline" className="w-full">
                  Account
                </Button>
              </Link>

              <LogoutButton className="w-full">
                <Button className="w-full">Log Out</Button>
              </LogoutButton>
            </div>
          ) : (
            <div className="flex flex-col w-full space-y-1" onClick={closeMenu}>
              <Link href="/login">
                <Button variant="outline" className="w-full">
                  Log In
                </Button>
              </Link>
              <Link href="/create-account">
                <Button className="w-full">Create An Account</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MobileNav;
