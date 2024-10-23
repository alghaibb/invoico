"use server";

import bcrypt from "bcrypt";
import { flattenValidationErrors } from "next-safe-action";

import prisma from "@/lib/prisma";
import { actionClient } from "@/lib/safe-action";
import { getSession } from "@/utils/session";
import { UpdatePasswordSchema } from "@/validations/auth";

export const updatePassword = actionClient
  .schema(UpdatePasswordSchema, {
    handleValidationErrorsShape: (ve) => flattenValidationErrors(ve),
  })
  .action(
    async ({
      parsedInput: { currentPassword, newPassword, confirmNewPassword },
    }) => {
      const session = await getSession();

      if (!session || !session.user || !session.user.id) {
        return { error: "User not authenticated" }; // Fix this check
      }

      // Fetch user from db using session id
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
      });

      if (!user) {
        return { error: "User not found" };
      }

      // Check if current password is correct
      const isPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password as string,
      );

      if (!isPasswordValid) {
        return { error: "Current password is incorrect" };
      }

      // Check if new password and confirm new password match
      if (newPassword !== confirmNewPassword) {
        return { error: "Passwords do not match" };
      }

      // Check if the new password is the same as the current password
      if (await bcrypt.compare(newPassword, user.password as string)) {
        return {
          error: "New password must be different from the current password",
        };
      }

      // Hash the new password
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);

      // Update the user's password in the database
      await prisma.user.update({
        where: { id: user.id },
        data: {
          password: hashedNewPassword,
        },
      });

      return { success: "Password successfully updated" };
    },
  );
