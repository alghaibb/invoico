"use client";

import { usePathname } from "next/navigation";

import { pagesWithoutFooter } from "@/constants";

import { Separator } from "./ui/separator";

const Footer = () => {
  const pathname = usePathname();

  // Check if any path in pagesWithoutFooter matches the current path
  const shouldHideFooter = pagesWithoutFooter.some((page) =>
    pathname.startsWith(page),
  );

  if (shouldHideFooter) {
    return null;
  }
  return (
    <footer className="py-10 text-foreground bg-background">
      <Separator />
      <div className="pt-4 mt-8 text-sm text-center">
        © {new Date().getFullYear()} Invoico. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
