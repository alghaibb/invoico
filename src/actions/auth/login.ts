"use server";

import bcrypt from "bcrypt";
import { flattenValidationErrors } from "next-safe-action";

import { signIn } from "@/auth";
import { getIp } from "@/lib/get-ip";
import { rateLimitByIp, rateLimitByKey } from "@/lib/limiter";
import { actionClient } from "@/lib/safe-action";
import { getUserByEmail } from "@/utils/user/getUser";
import { LoginSchema } from "@/validations/auth";

export const login = actionClient
  .schema(LoginSchema, {
    handleValidationErrorsShape: (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput: { email, password } }) => {
    const ip = getIp();

    // Apply rate limiting by IP first
    try {
      await rateLimitByIp({
        key: `login-${ip}`,
        limit: 5,
        window: 10 * 60 * 1000, // 10 minutes
      });
    } catch (error) {
      return {
        error: "Too many requests from your IP. Please try again later.",
      };
    }

    // Try to get the user by email
    const user = await getUserByEmail(email);

    // Apply email-based rate limiting even if the user exists
    try {
      await rateLimitByKey({
        key: `login-${email}`,
        limit: 5,
        window: 10 * 60 * 1000, // 10 minutes window
      });
    } catch (error) {
      return {
        error: "Your account has been temporarily locked due to too many failed login attempts. Please try again later.",
      };
    }
    // Check if user exists and is verified
    if (!user || !user.emailVerified) {
      return {
        error: user ? "Please verify your email address to log in." : "Invalid email or password",
      };
    }
    // Compare the password
    const match = await bcrypt.compare(password, user.password as string);

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
      return {
        error: "Authentication failed. Please check your credentials and try again.",
      };
    }

    // Return success
    return {
      success: true,
    };
  });
