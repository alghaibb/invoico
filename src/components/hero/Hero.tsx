import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaArrowDown } from "react-icons/fa";

import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="relative flex items-center justify-center mt-20 min-h-screen">
      <div className="container grid grid-cols-1 gap-8 px-6 py-16 md:grid-cols-2 animate-fade-in">
        {/* Left: Text and CTA */}
        <div className="flex flex-col justify-center space-y-6">
          <h1 className="text-5xl font-bold md:text-7xl drop-shadow-lg">
            Create Your Invoices in Minutes
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground">
            Manage your billing and invoicing effortlessly. With our invoicing
            tool, creating and managing invoices is quick and simple.
          </p>

          {/* Create Invoice Button */}
          <Link href="/invoices/new-invoice" className="md:max-w-1">
            <Button variant="hero" size="xl" className="w-full md:w-auto">
              Create Your First Invoice <FaArrowDown className="ml-2" />
            </Button>
          </Link>
        </div>

        {/* Right: Image */}
        <div className="flex items-center justify-center drop-shadow-2xl">
          <Image
            src="/invoice-illustration.png"
            alt="Create Invoice"
            width={1000}
            height={1000}
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
