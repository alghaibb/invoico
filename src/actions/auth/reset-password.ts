"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { getUserByResetPasswordToken } from "@/utils/getUser";
import { deleteResetPasswordToken } from "@/utils/token";
import { actionClient } from "@/lib/safe-action";
import { flattenValidationErrors } from "next-safe-action";
import { ResetPasswordSchema } from "@/schemas/auth";

export const resetPassword = actionClient
  .schema(ResetPasswordSchema, {
    handleValidationErrorsShape: (ve) => flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput: { password, confirmPassword, token } }) => {
    // Find user by reset password token
    const user = await getUserByResetPasswordToken(token);

    // If user not found, return error
    if (!user) {
      return { error: "Invalid or expired reset password token" };
    }

    // If passwords do not match, return error
    if (password !== confirmPassword) {
      return { error: "Passwords do not match" };
    }

    // If password is the same as the current password, return error
    if (await bcrypt.compare(password, user.password as string)) {
      return { error: "New password must be different from the current password" };
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user's password in the database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
      },
    });

    // Safely delete the reset password token
    try {
      await deleteResetPasswordToken(token);
    } catch (error) {
      console.error("Failed to delete the reset password token:", error);
      return { error: "An error occurred while processing the reset password token" };
    }

    return { success: true };
  });
