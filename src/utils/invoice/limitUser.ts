import prisma from "@/lib/prisma";
import { startOfMonth } from "date-fns";
import { getUserByIdWithPlan } from "../user/getUser";

export async function limitUserInvoices(userId: string) {
  const currentMonthStart = startOfMonth(new Date());

  // Get the user and their plan
  const user = await getUserByIdWithPlan(userId);

  if (!user) {
    throw new Error("User not found");
  }

  // Check the invoice limit based on the users plan
  const invoiceLimit = user.Plan ? user.Plan.invoiceLimit : 10; // Default to 10 invoices

  // Find or create the users monthy usage record for the current month
  let userUsage = await prisma.userMonthlyUsage.findUnique({
    where: { userId },
  });

  // If no record exists or the record is for a previous month, reset for the current month
  if (!userUsage || userUsage.month < currentMonthStart) {
    userUsage = await prisma.userMonthlyUsage.upsert({
      where: { userId },
      update: { month: currentMonthStart, invoices: 1 }, // Reset invoice count for the new month
      create: { userId, month: currentMonthStart, invoices: 1 },
    });
  } else {
    // If the user has already created the maximum number of invoices this month
    if (userUsage.invoices >= invoiceLimit) {
      throw new Error(
        `You have reached the maximum number of invoices for this month according to your plan. Please wait until next month or upgrade your plan to create more invoices.`
      );
    }

    // If under the limit, increment the invoice count
    await prisma.userMonthlyUsage.update({
      where: { userId },
      data: { invoices: { increment: 1 } },
    });
  }

  return true; // User is allowed to create an invoice
}