"use client";

import { motion } from "framer-motion";

import {
  Accordion,
  AccordionTrigger,
  AccordionContent,
  AccordionItem,
} from "./ui/accordion";

const FaqSection = () => {
  return (
    <section className="py-10 text-foreground bg-background" id="faq">
      <motion.div
        className="container px-6 mx-auto"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <motion.h2
          className="mb-8 text-4xl font-bold text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.5 }}
        >
          FAQs
        </motion.h2>

        <Accordion type="single" collapsible className="space-y-4">
          <AccordionItem value="item-1">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.5 }}
            >
              <AccordionTrigger className="hover:no-underline">
                What is Invoico?
              </AccordionTrigger>
              <AccordionContent>
                Invoico is an invoicing platform designed to help you create and
                send professional invoices quickly and efficiently.
              </AccordionContent>
            </motion.div>
          </AccordionItem>

          <AccordionItem value="item-2">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.5 }}
            >
              <AccordionTrigger className="hover:no-underline">
                How can I create an invoice?
              </AccordionTrigger>
              <AccordionContent>
                You can create an invoice by navigating to the invoice creation
                page and filling out the required details such as client
                information, item details, and payment terms.
              </AccordionContent>
            </motion.div>
          </AccordionItem>

          <AccordionItem value="item-3">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6, duration: 0.5 }}
            >
              <AccordionTrigger className="hover:no-underline">
                What payment methods can my customers use?
              </AccordionTrigger>
              <AccordionContent>
                Customers can use credit cards, debit cards, and other online
                payment options to settle invoices created through Invoico.
              </AccordionContent>
            </motion.div>
          </AccordionItem>

          <AccordionItem value="item-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8, duration: 0.5 }}
            >
              <AccordionTrigger className="hover:no-underline">
                Are there any restrictions on the number of invoices I can
                create?
              </AccordionTrigger>
              <AccordionContent>
                Yes, the number of invoices you can create depends on your plan.
                As a guest you can create up to 5 invoices before you need to
                create an account.
              </AccordionContent>
            </motion.div>
          </AccordionItem>
          
          <AccordionItem value="item-5">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8, duration: 0.5 }}
            >
              <AccordionTrigger className="hover:no-underline">
                What plans do you offer?
              </AccordionTrigger>
              <AccordionContent>
                We offer a free plan that allows you to create up to 10 invoices
                every month. We also offer a premium plan that allows you to
                create unlimited invoices and access additional features.
              </AccordionContent>
            </motion.div>
          </AccordionItem>
        </Accordion>
      </motion.div>
    </section>
  );
};

export default FaqSection;
