import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );

    // Check if there are invoices that are overdue
    const overdueInvoicesCheck = await prisma.invoice.findMany({
      where: {
        status: "PENDING",
        dueDate: {
          lt: startOfToday, // Compare only the date part
        },
      },
    });

    if (overdueInvoicesCheck.length === 0) {
      return NextResponse.json(
        { message: "No overdue invoices found." },
        { status: 200 },
      );
    }

    // Update overdue invoices
    const overdueInvoices = await prisma.invoice.updateMany({
      where: {
        status: "PENDING",
        dueDate: {
          lt: startOfToday,
        },
      },
      data: {
        status: "OVERDUE",
      },
    });

    return NextResponse.json(
      { message: `${overdueInvoices.count} invoices marked as overdue.` },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error marking invoices as overdue:", error);
    return NextResponse.json(
      { error: "Failed to mark invoices as overdue." },
      { status: 500 },
    );
  }
}
