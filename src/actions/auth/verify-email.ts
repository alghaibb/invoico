"use server"

import { flattenValidationErrors } from "next-safe-action";

import { rateLimitByIp } from "@/lib/limiter";
import prisma from "@/lib/prisma";
import { actionClient } from "@/lib/safe-action";
import { getSession } from "@/utils/session";
import { verifyVerificationCode, deleteVerificationCode } from "@/utils/token";
import { VerifyEmailSchema } from "@/validations/auth";

export const verifyEmail = actionClient
  .schema(VerifyEmailSchema, {
    handleValidationErrorsShape: (ve) => flattenValidationErrors(ve),
  })
  .action(async ({ parsedInput: { otp } }) => {
    // Rate limit by IP to 5 requests in a 10-minute window
    try {
      await rateLimitByIp({
        key: `verify-email-${otp}`, // Keyed by otp to prevent abuse
        limit: 5,
        window: 10 * 60 * 1000, // 10 minutes window
      });
    } catch (error) {
      return {
        error: "Too many requests. Please try again later.",
      };
    }

    // Verify the OTP
    const { user, error } = await verifyVerificationCode(otp);

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
