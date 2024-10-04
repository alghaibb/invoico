// /app/api/invoices/[invoiceId]/route.ts

import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/utils/session";

export async function DELETE(req: NextRequest, { params }: { params: { invoiceId: string } }) {
  const invoiceId = params.invoiceId;

  try {
    // Get the current session and user ID
    const session = await getSession();
    const userId = session?.user?.id;

    // If there is no logged-in user, block deletion for guests
    if (!userId) {
      return NextResponse.json({ error: "Guests are not allowed to delete invoices. Please log in." }, { status: 403 });
    }

    // Check if the invoice exists and belongs to the authenticated user
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      select: { userId: true, guestId: true }, // Select userId and guestId to differentiate between guests and users
    });

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    // Verify the invoice belongs to the authenticated user and is not a guest invoice
    if (invoice.guestId) {
      return NextResponse.json({ error: "Guest users cannot delete invoices." }, { status: 403 });
    }

    if (invoice.userId !== userId) {
      return NextResponse.json({ error: "You do not have permission to delete this invoice." }, { status: 403 });
    }

    // Delete the invoice
    await prisma.invoice.delete({
      where: { id: invoiceId },
    });

    return NextResponse.json({ success: "Invoice successfully deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting invoice:", error);
    return NextResponse.json({ error: "An error occurred while deleting the invoice" }, { status: 500 });
  }
}
