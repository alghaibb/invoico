"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaArrowDown } from "react-icons/fa";

import { Button } from "@/components/ui/button";

const Hero = () => {
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
            Create Your Invoices in Minutes
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4, ease: "easeOut" }} // Shorter duration and smaller delay
            className="text-xl md:text-2xl text-muted-foreground"
          >
            Manage your billing and invoicing effortlessly. With our invoicing
            tool, creating and managing invoices is quick and simple.
          </motion.p>

          {/* Create Invoice Button */}
          <Link href="/invoices/new-invoice" className="md:max-w-1">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4, ease: "easeOut" }} // Shorter duration and smaller delay
            >
              <Button variant="hero" size="xl" className="w-full md:w-auto">
                Create Your First Invoice <FaArrowDown className="ml-2" />
              </Button>
            </motion.div>
          </Link>
        </div>

        {/* Right: Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.4, ease: "easeOut" }} // Shorter duration and smaller delay
          className="flex items-center justify-center drop-shadow-2xl"
        >
          <Image
            src="/invoice-illustration.png"
            alt="Create Invoice"
            width={1000}
            height={1000}
            className="object-cover"
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
