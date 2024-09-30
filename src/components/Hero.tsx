import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { FaArrowDown } from "react-icons/fa";

const Hero = () => {
  return (
    <section className="relative flex items-center justify-center mt-16 bg-gradient-to-r from-purple-500 to bg-primary">
      <div className="container grid grid-cols-1 gap-8 px-6 py-16 text-secondary md:grid-cols-2">
        {/* Left: Text and CTA */}
        <div className="flex flex-col justify-center space-y-6">
          <h1 className="text-4xl font-bold md:text-5xl text-secondary">
            Create Your Invoices in Minutes
          </h1>
          <p className="text-lg md:text-xl text-secondary">
            Manage your billing and invoicing effortlessly. With our invoicing
            tool, creating and managing invoices is quick and simple.
          </p>

          {/* Create Invoice Button */}
          <Link href="/invoices/new-invoice" className="md:max-w-1">
            <Button variant="navbar" size="lg" className="w-full md:w-auto">
              Create Your First Invoice <FaArrowDown className="ml-2" />
            </Button>
          </Link>
        </div>

        {/* Right: Image */}
        <div className="flex items-center justify-center">
          <Image
            src="/invoice-illustration.png"
            alt="Create Invoice"
            width={400}
            height={400}
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
