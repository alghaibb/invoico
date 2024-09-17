import React from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

interface BackButtonProps {
  label: string;
  href: string;
}

const BackButton = ({ label, href }: BackButtonProps) => {
  return (
    <Button
      variant="link"
      type="button"
      className="w-full font-normal"
      size="sm"
      asChild
    >
      <Link href={href}>{label}</Link>
    </Button>
  );
};

export default BackButton;