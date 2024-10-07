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
          Plan: true,
          Invoice: {
            include: { InvoiceItem: true },
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
      const { success, remainingInvoices, error } = await limitUserInvoices(userId);

      // If the user has reached their invoice limit
      if (!success) {
        return NextResponse.json(
          {
            invoices: user.Invoice,
            remainingInvoices,
            message: error,
          },
          { status: 200 }
        );
      }

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
            include: { InvoiceItem: true },
          },
        },
      });

      // Check remaining invoices for the guest
      const { success, remainingInvoices, error } = await limitGuestInvoices();

      // If the guest has no remaining invoices
      if (!success) {
        return NextResponse.json(
          {
            invoices: guestUsage?.Invoice || [],
            remainingInvoices,
            message: error,
          },
          { status: 200 }
        );
      }

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
