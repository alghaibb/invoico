"use server";

import { flattenValidationErrors } from "next-safe-action";

import { rateLimitByIp } from "@/lib/limiter";
import prisma from "@/lib/prisma";
import { actionClient } from "@/lib/safe-action";
import { getSession } from "@/utils/session";
import { ContactFormSchema } from "@/validations";

export const createContactMessage = actionClient
  .schema(ContactFormSchema, {
    handleValidationErrorsShape: (ve) => flattenValidationErrors(ve),
  })
  .action(async ({ parsedInput: { name, email, subject, message } }) => {
    // Get user session from the server
    const session = await getSession(); // Fetch session using the utility or NextAuth

    // If the user is logged in, use their email from the session
    const userId = session?.user?.id || null;
    const userEmail = session?.user?.email || email; // Use session email if available, otherwise use form input

    // Apply rate limiting by IP, limiting to 5 requests in a 10-minute window
    try {
      await rateLimitByIp({
        key: `create-contact-message=${userEmail}`,
        limit: 5,
        window: 10 * 60 * 1000, // 10 minutes window
      });
    } catch (error) {
      return {
        error: "Too many requests. Please try again later.",
      };
    }

    // Check if authenticated user's email matches the provided email (only if user is authenticated)
    if (session && email !== userEmail) {
      return {
        error: "Authenticated user's email doesn't match the provided email.",
      };
    }

    // Create the contact message in the database
    const contactMessage = await prisma.contact.create({
      data: {
        name,
        email: userEmail, // Use session email or provided email
        subject,
        message,
        userId,
      },
    });

    return {
      success:
        "Your message was sent successfully, we will get back to you as soon as possible.",
      contactMessage,
    };
  });
