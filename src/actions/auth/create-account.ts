"use server"

import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { getUserByEmail } from "@/utils/getUser";
import { CreateAccountSchema } from "@/schemas/auth";
import { actionClient } from "@/lib/safe-action";
import { flattenValidationErrors } from "next-safe-action";
import { rateLimitByIp } from "@/lib/limiter";
import { sendVerificationEmail } from "@/utils/sendEmails";
import { generateVerificationCode } from "@/utils/token";

export const createAccount = actionClient
  .schema(CreateAccountSchema, {
    handleValidationErrorsShape: (ve) => flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput: { firstName, lastName, email, password, confirmPassword } }) => {

    // Apply rate limiting by IP, limiting to 5 requests in a 10-minute window 
    try {
      await rateLimitByIp(email, "create-account", {
        key: "create-account",
        limit: 5,
        window: 10 * 60 * 1000, // 10 minutes window
      });
    } catch (error) {
      return {
        error: "Too many requests. Please try again later.",
      };
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(email)

    if (existingUser) {
      return {
        error: "Email already in use",
      }
    }

    // Check if password and confirm password match
    if (password !== confirmPassword) {
      return {
        error: "Passwords do not match",
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
      }
    });

    // Generate verification code
    const verificationCode = await generateVerificationCode(email);

    // Send verification email
    await sendVerificationEmail(email, firstName, verificationCode);

    // Return success
    return {
      success: true,
    };

  })