"use server";

import bcrypt from "bcrypt";
import { flattenValidationErrors } from "next-safe-action";

import { getIp } from "@/lib/get-ip";
import { rateLimitByIp } from "@/lib/limiter";
import prisma from "@/lib/prisma";
import { actionClient } from "@/lib/safe-action";
import { sendVerificationEmail } from "@/utils/sendEmails";
import { generateVerificationCode } from "@/utils/token";
import { getUserByEmail } from "@/utils/user/getUser";
import { CreateAccountSchema } from "@/validations/auth";

export const createAccount = actionClient
  .schema(CreateAccountSchema, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(
    async ({
      parsedInput: { firstName, lastName, email, password, confirmPassword },
    }) => {
      const ip = getIp();

      // Apply rate limiting by IP, limiting to 5 requests in a 10-minute window
      try {
        await rateLimitByIp({
          key: `create-account-${ip}`,
          limit: 5,
          window: 10 * 60 * 1000, // 10 minutes window
        });
      } catch (error) {
        return {
          error: "Too many requests. Please try again later.",
        };
      }

      // Check if user already exists
      const existingUser = await getUserByEmail(email);

      if (existingUser) {
        return {
          error: "Email already in use",
        };
      }

      // Check if password and confirm password match
      if (password !== confirmPassword) {
        return {
          error: "Passwords do not match",
        };
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Check for the FREE plan, and if it doesn't exist, create it dynamically
      let freePlan = await prisma.plan.findFirst({
        where: { type: "FREE" },
      });

      // If the FREE plan doesn't exist, create it
      if (!freePlan) {
        freePlan = await prisma.plan.create({
          data: {
            type: "FREE",
            invoiceLimit: 10, // Adjust as needed
          },
        });
      }

      // Create user
      await prisma.user.create({
        data: {
          firstName,
          lastName,
          email,
          password: hashedPassword,
          planId: freePlan.id,
        },
      });

      // Generate verification code
      const verificationCode = await generateVerificationCode(email);

      // Send verification email
      await sendVerificationEmail(email, firstName, verificationCode);

      // Return success
      return {
        success: true,
      };
    },
  );
