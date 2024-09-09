"use server"

import prisma from "@/lib/prisma";
import { VerifyEmailSchema } from "@/schemas/auth";
import { actionClient } from "@/lib/safe-action";
import { flattenValidationErrors } from "next-safe-action";
import { verifyVerificationCode, deleteVerificationCode } from "@/utils/token";
import { rateLimitByIp } from "@/lib/limiter";

export const verifyEmail = actionClient
  .schema(VerifyEmailSchema, {
    handleValidationErrorsShape: (ve) => flattenValidationErrors(ve),
  })
  .action(async ({ parsedInput: { email, otp } }) => {

    // Rate limit by IP to 5 requests in a 10-minute window
    try {
      await rateLimitByIp(email, "verify-email", {
        key: `verify-email-${email}`, // Keyed by email to prevent abuse
        limit: 5,
        window: 10 * 60 * 1000, // 10 minutes window
      });
    } catch (error) {
      return {
        error: "Too many requests. Please try again later.",
      };
    }

    // Verify the OTP
    const { user, error } = await verifyVerificationCode(otp, email);

    if (error) {
      // Return the specific error (invalid or expired OTP)
      return { error };
    }

    if (!user) {
      return { error: "Invalid OTP or email address" };
    }

    // Update the user's email verification status
    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: new Date() },
    });

    // Delete the verification code from the database
    await deleteVerificationCode(otp);

    return { success: true };
  });
