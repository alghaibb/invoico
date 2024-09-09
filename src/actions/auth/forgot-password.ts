"use server"

import { getUserByEmail } from "@/utils/getUser";
import { generateResetPasswordToken } from "@/utils/token";
import { actionClient } from "@/lib/safe-action";
import { ForgotPasswordSchema } from "@/schemas/auth";
import { flattenValidationErrors } from "next-safe-action";
import { sendForgotPasswordEmail } from "@/utils/sendEmails";
import { rateLimitByIp } from "@/lib/limiter";

export const forgotPassword = actionClient
  .schema(ForgotPasswordSchema, {
    handleValidationErrorsShape: (ve) => flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput: { email } }) => {
    // Get the user by email
    const user = await getUserByEmail(email);

    // If user is not found, return an error
    if (!user) {
      return {
        error: "Something went wrong. Please try again later.",
      };
    }

    // Apply rate limiting by IP, limiting to 5 requests in a 10-minute window
    try {
      await rateLimitByIp(email, "forgot-password", {
        key: `forgot-password-${email}`,
        limit: 5,
        window: 10 * 60 * 1000, // 10 minutes window
      });
    } catch (error) {
      return {
        error: "Too many requests. Please try again later.",
      };
    }

    // Generate a reset password token
    const resetPasswordToken = await generateResetPasswordToken(email);

    // Send the reset password email
    await sendForgotPasswordEmail(email, user.firstName as string, resetPasswordToken);

    // Return success
    return {
      success: true,
      message: "Password reset email sent. Please check your inbox.",
    };
  });