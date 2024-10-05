import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const now = new Date();

    // Find overdue invoices
    const overdueInvoices = await prisma.invoice.updateMany({
      where: {
        status: "PENDING",
        dueDate: {
          lt: now,
        },
      },
      data: {
        status: "OVERDUE",
      },
    });

    return NextResponse.json({ message: `${overdueInvoices.count} invoices marked as overdue.` }, { status: 200 });
  } catch (error) {
    console.error("Error marking invoices as overdue:", error);
    return NextResponse.json({ error: "Failed to mark invoices as overdue." }, { status: 500 });
  }
}
