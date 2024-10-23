"use client";

import { cn } from "@/lib/utils";

import BackButton from "./back-button";
import FormHeader from "./card-header";
import { Card, CardContent, CardHeader, CardFooter } from "./ui/card";

interface CardWrapperProps {
  children: React.ReactNode;
  label: string;
  title: string;
  backButtonHref: string;
  backButtonLabel: string;
  className?: string;
}

const CardWrapper = ({
  children,
  label,
  title,
  backButtonHref,
  backButtonLabel,
  className,
}: CardWrapperProps) => {
  return (
    <Card
      className={cn(
        "w-full shadow-md xl:w-1/4 md:w-1/2",
        "px-4 py-4 md:px-0 md:py-0",
        className,
      )}
    >
      <CardHeader className="pt-6 text-center sm:pt-8 md:pt-10 lg:pt-12">
        <FormHeader label={label} title={title} />
      </CardHeader>
      <CardContent>{children}</CardContent>
      <CardFooter>
        <BackButton label={backButtonLabel} href={backButtonHref} />
      </CardFooter>
    </Card>
  );
};

export default CardWrapper;
