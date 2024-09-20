"use server";

import bcrypt from "bcrypt";
import { getUserByEmail } from "@/utils/getUser";
import { actionClient } from "@/lib/safe-action";
import { LoginSchema } from "@/validations/auth";
import { flattenValidationErrors } from "next-safe-action";
import { signIn } from "@/auth";
import { rateLimitByIp } from "@/lib/limiter";

export const login = actionClient
  .schema(LoginSchema, {
    handleValidationErrorsShape: (ve) => flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput: { email, password } }) => {
    // Get the user by email
    const user = await getUserByEmail(email);

    // If user is not found, return an error
    if (!user || !user.password) {
      return {
        error: "Invalid email or password",
      };
    }

    // Apply rate limiting by IP, limiting to 5 requests in a 10-minute window
    try {
      await rateLimitByIp(email, "login", {
        key: `login-${email}`,
        limit: 5,
        window: 10 * 60 * 1000, // 10 minutes window
      });
    } catch (error) {
      return {
        error: "Too many requests. Please try again later.",
      };
    }

    // Check if user is verified
    if (!user.emailVerified) {
      return {
        error: "Please verify your email address to log in.",
      };
    }

    // Compare the password
    const match = await bcrypt.compare(password, user.password);

    // If password does not match, return an error
    if (!match) {
      return {
        error: "Invalid email or password",
      };
    }

    // Sign the user in using credentials provider
    const loginResponse = await signIn("credentials", {
      redirect: false, // prevent automatic redirect
      email,
      password,
    });

    // Check if login was unsuccessful
    if (loginResponse?.error) {
      // The `signIn` method could return an error message here
      return {
        error: "Authentication failed. Please check your credentials and try again.",
      };
    }

    // Return success
    return {
      success: true,
    };
  });
