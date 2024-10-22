"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";
import { FaArrowDown } from "react-icons/fa";

import { Button } from "@/components/ui/button";

import { LoadingDots } from "./loading";

// Add a prop to indicate if the user has invoices
const Hero = ({ hasInvoice }: { hasInvoice: boolean }) => {
  const [loading, setLoading] = useState(false);
  const [buttonWidth, setButtonWidth] = useState<number | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const CTAClick = () => {
    setLoading(true);
  };

  // Get the button's width before loading starts
  useEffect(() => {
    if (buttonRef.current && !loading) {
      setButtonWidth(buttonRef.current.offsetWidth);
    }
  }, [loading]);

  return (
    <section className="relative flex items-center justify-center min-h-screen mt-20 md:mt-0">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }} // Shorter duration
        className="container grid grid-cols-1 gap-8 px-6 py-16 md:grid-cols-2"
      >
        {/* Left: Text and CTA */}
        <div className="flex flex-col justify-center space-y-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4, ease: "easeOut" }} // Shorter duration and smaller delay
            className="text-5xl font-bold md:text-7xl drop-shadow-lg"
          >
            {hasInvoice
              ? "Manage Your Invoices"
              : "Create Your Invoices in Minutes"}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4, ease: "easeOut" }} // Shorter duration and smaller delay
            className="text-xl md:text-2xl text-muted-foreground"
          >
            {hasInvoice
              ? "You can view, edit, or send your invoices from your dashboard."
              : "Manage your billing and invoicing effortlessly. With our invoicing tool, creating and managing invoices is quick and simple."}
          </motion.p>

          {/* Conditionally render the CTA button */}
          <Link
            href={hasInvoice ? "/invoices" : "/invoices/new-invoice"}
            className="md:max-w-1"
            onClick={CTAClick}
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4, ease: "easeOut" }} // Shorter duration and smaller delay
            >
              <Button
                variant="hero"
                size="xl"
                ref={buttonRef}
                className="w-full md:w-auto"
                style={{
                  width: loading && buttonWidth ? `${buttonWidth}px` : "auto",
                }}
                disabled={loading}
              >
                {loading ? (
                  <LoadingDots />
                ) : (
                  <>
                    {hasInvoice
                      ? "View Your Invoices"
                      : "Create Your First Invoice"}{" "}
                    <FaArrowDown className="ml-2" />
                  </>
                )}
              </Button>
            </motion.div>
          </Link>
        </div>

        {/* Right: Conditionally render the image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.4, ease: "easeOut" }} // Shorter duration and smaller delay
          className="flex items-center justify-center drop-shadow-2xl"
        >
          <Image
            src="/invoice-illustration.png"
            alt={hasInvoice ? "Manage Invoice" : "Create Invoice"}
            width={1000}
            height={1000}
            className="object-cover"
            priority
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
