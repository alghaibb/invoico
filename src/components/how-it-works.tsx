"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import React from "react";

import { Button } from "@/components/ui/button";
import { howItWorksSteps } from "@/constants";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.2,
    },
  },
};

const titleVariants = {
  hidden: { opacity: 0, y: -50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const iconVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.5,
      type: "spring",
      stiffness: 260,
      damping: 20,
    },
  },
};

const HowItWorks = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted">
      <motion.div
        className="container mx-auto text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.h2
          className="mb-12 text-5xl font-bold"
          variants={titleVariants}
        >
          How It Works
        </motion.h2>

        <motion.div
          className="grid grid-cols-1 gap-12 md:grid-cols-3"
          variants={containerVariants}
        >
          {howItWorksSteps.map((step, index) => (
            <motion.div
              key={index}
              className="p-8 transition-all duration-300 rounded-lg shadow-lg bg-background hover:shadow-xl"
              variants={cardVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="flex items-center justify-center w-20 h-20 mx-auto mb-6 text-4xl rounded-full text-background bg-primary"
                variants={iconVariants}
              >
                <step.icon />
              </motion.div>

              <h3 className="mb-4 text-2xl font-semibold text-gray-800">
                {step.title}
              </h3>
              <p className="mb-6 text-muted-foreground">{step.description}</p>

              {step.link && step.buttonText && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="outline"
                    asChild
                    aria-label={step.buttonText}
                  >
                    <Link href={step.link}>{step.buttonText}</Link>
                  </Button>
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HowItWorks;
