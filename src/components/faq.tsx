"use client";

import { motion } from "framer-motion";

import { faqItems } from "@/constants";

import {
  Accordion,
  AccordionTrigger,
  AccordionContent,
  AccordionItem,
} from "./ui/accordion";

const FaqSection = () => {
  return (
    <section
      className="py-20 text-foreground bg-gradient-to-b from-muted to-background"
      id="faq"
    >
      <motion.div
        className="container max-w-md px-6 mx-auto md:max-w-4xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <motion.h2
          className="mb-8 text-5xl font-bold text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.5 }}
        >
          FAQs
        </motion.h2>

        <Accordion type="single" collapsible className="space-y-4">
          {faqItems.map((faq, index) => (
            <AccordionItem value={faq.id} key={faq.id}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + index * 0.2, duration: 0.5 }}
              >
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </motion.div>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>
    </section>
  );
};

export default FaqSection;
