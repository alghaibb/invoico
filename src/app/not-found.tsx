import Image from "next/image";
import Link from "next/link";
import React from "react";

import { Button } from "@/components/ui/button";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-center">
      <div className="max-w-md mx-auto">
        <Image
          src="/404-not-found.png"
          alt="404 Not Found"
          width={400}
          height={400}
        />
        <h1 className="mt-8 text-4xl font-bold">Page Not Found</h1>
        <p className="mt-4 text-lg text-muted-foreground px-4 sm:px-0">
          Sorry, the page you&apos;re looking for doesn&apos;t exist or has been
          moved.
        </p>
        <Link href="/">
          <Button className="mt-6 inline-block px-8 py-3" variant="link">
            Go Back Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
