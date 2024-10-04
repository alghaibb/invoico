"use server";

import prisma from "@/lib/prisma";
import { z } from "zod";
import { getSession } from "@/utils/session"; // Assuming you have session management in place

// Define Zod schema for invoice deletion
export const deleteInvoiceSchema = z.object({
  invoiceId: z.string(),
});

// Export the deleteInvoice action as an async function
export async function deleteInvoice({ invoiceId }: { invoiceId: string }) {
  try {
    // Get the current session and user ID
    const session = await getSession();
    const userId = session?.user?.id;

    // If there is no logged-in user, block deletion for guests
    if (!userId) {
      return { error: "Guests are not allowed to delete invoices. Please log in." };
    }

    // Check if the invoice exists and belongs to the authenticated user
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      select: { userId: true, guestId: true }, // Select userId and guestId to differentiate between guests and users
    });

    if (!invoice) {
      return { error: "Invoice not found" };
    }

    // Verify the invoice belongs to the authenticated user and is not a guest invoice
    if (invoice.guestId) {
      return { error: "Guest users cannot delete invoices." };
    }

    if (invoice.userId !== userId) {
      return { error: "You do not have permission to delete this invoice." };
    }

    // Delete the invoice
    await prisma.invoice.delete({
      where: { id: invoiceId },
    });

    return { success: "Invoice successfully deleted" };
  } catch (error) {
    console.error("Error deleting invoice:", error);
    return { error: "An error occurred while deleting the invoice" };
  }
}
