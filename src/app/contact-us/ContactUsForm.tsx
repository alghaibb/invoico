"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAction } from "next-safe-action/hooks";
import { ContactFormSchema } from "@/validations";
import { LoadingDots } from "@/components/ui/loading";
import { Message } from "@/components/ui/custom-message";
import CardWrapper from "@/components/card-wrapper";
import { createContactMessage } from "@/actions/contact";

// Define types based on Zod schema
type ContactFormData = z.infer<typeof ContactFormSchema>;

const ContactUsForm: React.FC = () => {
  const { execute, result, isExecuting } = useAction(createContactMessage);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const [sessionName, setSessionName] = useState<string | null>(null);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(ContactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  // Retrieve user session on mount and pre-fill email if available
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch("/api/get-session");
        const data = await res.json();

        if (data.user) {
          const fullName = `${data.user.firstName} ${data.user.lastName}`;
          setSessionEmail(data.user.email);
          setSessionName(fullName);
          form.setValue("email", data.user.email);
          form.setValue("name", fullName);
        }
      } catch (error) {
        console.error("Error fetching session:", error);
      }
    };
    fetchSession();
  }, [form]);

  const onSubmit = async (data: ContactFormData) => {
    setError(null); // Reset error message
    setSuccess(null); // Reset success message
    execute(data);
  };

  useEffect(() => {
    if (result?.data?.success) {
      setSuccess(result.data.success);
      form.reset({
        name: sessionName || "",
        email: sessionEmail || "",
        subject: "",
        message: "",
      });
    } else if (result?.data?.error) {
      setError(result.data.error);
    }
  }, [result, form, sessionEmail, sessionName]);

  return (
    <CardWrapper
      label="Please fill out the form below to send us a message."
      title="Send Us A Message"
      backButtonHref="/"
      backButtonLabel="Back to Home"
    >
      {error && <Message type="error" message={error} />}
      {success && <Message type="success" message={success} />}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} disabled={!!sessionName || isExecuting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} disabled={!!sessionEmail || isExecuting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isExecuting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message</FormLabel>
                <FormControl>
                  <textarea
                    {...field}
                    rows={4}
                    className="w-full border p-2"
                    disabled={isExecuting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="relative flex items-center justify-center">
            <Button type="submit" disabled={isExecuting} className="w-full">
              {isExecuting ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <LoadingDots />
                </div>
              ) : (
                "Send Message"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default ContactUsForm;
