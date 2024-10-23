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

  // Check the invoice limit based on the user's plan, default to 10 invoices if plan is missing
  const invoiceLimit = user.Plan?.invoiceLimit || 10;

  // Find the user's monthly usage record for the current month
  let userUsage = await prisma.userMonthlyUsage.findUnique({
    where: { userId },
    cacheStrategy: {
      ttl: 60, // Cache user usage for 60 seconds
      swr: 120, // Serve stale data for 120 seconds
    },
  });

  // If no record exists or the record is for a previous month, return the full limit for the current month
  if (!userUsage || userUsage.month < currentMonthStart) {
    return { success: true, remainingInvoices: invoiceLimit };
  }

  // Calculate remaining invoices
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
