import { startOfMonth } from "date-fns";

import prisma from "@/lib/prisma";

import { getUserByIdWithPlan } from "../user/getUser";

export async function limitUserInvoices(userId: string) {
  const currentMonthStart = startOfMonth(new Date());

  // Get the user and their plan
  const user = await getUserByIdWithPlan(userId);
  if (!user) {
    return { success: false, error: "User not found", remainingInvoices: 0 };
  }

  // Default to the plan's invoice limit (e.g., 10)
  const invoiceLimit = user.Plan?.invoiceLimit || 10;

  // Find the user's monthly usage record for the current month
  let userUsage = await prisma.userMonthlyUsage.findUnique({
    where: { userId },
  });

  // Check if usage record is from the current month
  if (!userUsage || userUsage.month < currentMonthStart) {
    // Reset invoices if it's a new month or create a new record
    userUsage = await prisma.userMonthlyUsage.upsert({
      where: { userId },
      update: { month: currentMonthStart, invoices: 0 },
      create: {
        userId,
        month: currentMonthStart,
        invoices: 0,
      },
    });
  }

  // Calculate remaining invoices based on the current month's usage
  const remainingInvoices = invoiceLimit - userUsage.invoices;

  // If no remaining invoices, return with an error message
  if (remainingInvoices <= 0) {
    return {
      success: false,
      error: `You have reached your monthly invoice limit of ${invoiceLimit}. You can create more invoices next month or upgrade your plan for more.`,
      remainingInvoices: 0,
    };
  }

  return { success: true, remainingInvoices };
}
