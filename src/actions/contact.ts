"use server"

import prisma from "@/lib/prisma"
import { rateLimitByIp } from "@/lib/limiter"
import { actionClient } from "@/lib/safe-action"
import { ContactFormSchema } from "@/schemas"
import { flattenValidationErrors } from "next-safe-action"
import { auth } from "@/auth"

export const creatContactMessage = actionClient
  .schema(ContactFormSchema, {
    handleValidationErrorsShape: (ve) => flattenValidationErrors(ve),
  })
  .action(async ({ parsedInput: { name, email, subject, message } }) => {
    // Get user session
    const session = await auth();

    // Get user ID or null if not authenticated
    const userId = session?.user?.id || null;

    // Apply rate limiting by IP, limiting to 5 requests in a 10-minute window 
    try {
      await rateLimitByIp(email, "create-contact-message", {
        key: `create-contact-message=${email}`,
        limit: 5,
        window: 10 * 60 * 1000, // 10 minutes window
      });
    } catch (error) {
      return {
        error: "Too many requests. Please try again later.",
      };
    }

    // Check if authenticated user's email matches provided email
    if (session && email !== session.user.email) {
      return { error: "Authenticated user's email doesn't match provided email." };
    }

    const contactMessage = await prisma.contact.create({
      data: {
        name,
        email,
        subject,
        message,
        userId,
      }
    });

    return { success: "Your message was sent successfully, we will get back to you as soon as possible.", contactMessage };
  });