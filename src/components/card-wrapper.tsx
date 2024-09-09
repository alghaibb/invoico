"use client";

import { Card, CardContent, CardHeader, CardFooter } from "./ui/card";
import FormHeader from "./card-header";
import BackButton from "./back-button";

interface CardWrapperProps {
  children: React.ReactNode;
  label: string;
  title: string;
  backButtonHref: string;
  backButtonLabel: string;
}

const CardWrapper = ({
  children,
  label,
  title,
  backButtonHref,
  backButtonLabel,
}: CardWrapperProps) => {
  return (
    <Card className="w-full px-4 py-4 shadow-md xl:w-1/4 md:w-1/2 md:px-0 md:py-0">
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
