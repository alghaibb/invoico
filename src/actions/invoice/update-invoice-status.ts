"use server";

import { InvoiceStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

import prisma from "@/lib/prisma";
import { getSession } from "@/utils/session";

export async function updateInvoiceStatus(
  invoiceId: string,
  newStatus: InvoiceStatus
) {
  try {
    // Retrieve session to verify the user
    const session = await getSession();
    const userId = session?.user?.id;

    // Check if the invoice exists and retrieve ownership details
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      select: { userId: true, guestId: true, status: true },
    });

    if (!invoice) {
      return { error: "Invoice not found" };
    }

    // Ensure the invoice status differs from the new status to avoid redundant updates
    if (invoice.status === newStatus) {
      return {
        error: `Invoice is already marked as ${newStatus}.`,
      };
    }

    // Check if the user has permission to update the invoice
    if (invoice.userId && invoice.userId !== userId) {
      return {
        error: "You do not have permission to update this invoice.",
      };
    }

    // Update the invoice status if all checks pass
    await prisma.invoice.update({
      where: { id: invoiceId },
      data: { status: newStatus },
    });

    revalidatePath("/invoices", "page");

    return { success: "Invoice status updated successfully" };
  } catch (error) {
    console.error("Error updating invoice status:", error);
    return {
      error: "An unexpected error occurred while updating the invoice status.",
    };
  }
}
