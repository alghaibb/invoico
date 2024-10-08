"use server"

import { flattenValidationErrors } from "next-safe-action"

import { rateLimitByIp } from "@/lib/limiter"
import { actionClient } from "@/lib/safe-action"
import { sendVerificationEmail } from "@/utils/sendEmails"
import { generateVerificationCode } from "@/utils/token"
import { getUserByEmail } from "@/utils/user/getUser"
import { ResendVerificationEmailSchema } from "@/validations/auth"

export const resendOtp = actionClient
  .schema(ResendVerificationEmailSchema, {
    handleValidationErrorsShape: (ve) => flattenValidationErrors(ve),
  })
  .action(async ({ parsedInput: { email } }) => {
    // Find user by email
    const user = await getUserByEmail(email);

    // Apply rate limiting by IP, limiting to 5 requests in a 10-minute window 
    try {
      await rateLimitByIp(email, "resend-otp", {
        key: "resend-otp",
        limit: 1,
        window: 60 * 1000, // 1 minute
      });
    } catch (error) {
      return {
        error: "Too many requests. Please try again later.",
      };
    }

    const otp = await generateVerificationCode(email);

    if (!otp) {
      return { error: "Failed to resend OTP. Please try again later." }
    }

    // Send OTP to user's email
    await sendVerificationEmail(email, user?.firstName as string, otp);

    return { success: true, message: "OTP has been successfully resent to your email." }
  });