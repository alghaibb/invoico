export const dynamic = 'force-dynamic';

import { NextResponse, NextRequest } from "next/server";

import { getIp } from "@/lib/get-ip";
import prisma from "@/lib/prisma";
import { limitGuestInvoices, limitUserInvoices } from "@/utils/invoice";
import { getSession } from "@/utils/session";

export async function GET(request: NextRequest) {
  try {
    // Get session and user ID
    const session = await getSession();
    const userId = session?.user?.id;

    if (userId) {
      // Fetch the user with their plan details
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          Plan: true, // Ensure the full Plan object is included, not just planId
          Invoice: {
            include: { InvoiceItem: true }, // Include invoice items
          },
        },
      });

      if (!user) {
        return NextResponse.json(
          { error: "User not found." },
          { status: 404 }
        );
      }

      // Check remaining invoices for the user
      const { remainingInvoices } = await limitUserInvoices(userId);

      return NextResponse.json(
        {
          invoices: user.Invoice,
          remainingInvoices,
          plan: user.Plan, 
        },
        { status: 200 }
      );
    } else {
      // Handle guest logic
      const guestIp = getIp();
      if (!guestIp) {
        return NextResponse.json(
          { error: "Unable to retrieve guest IP" },
          { status: 400 }
        );
      }

      // Fetch guest invoices by IP address
      const guestUsage = await prisma.guestUsage.findUnique({
        where: { ipAddress: guestIp },
        include: {
          Invoice: {
            include: { InvoiceItem: true }, // Include the invoice items for the guest
          },
        },
      });

      // Check remaining invoices for the guest
      const { remainingInvoices } = await limitGuestInvoices();

      return NextResponse.json(
        { invoices: guestUsage?.Invoice || [], remainingInvoices },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching invoices." },
      { status: 500 }
    );
  }
}
