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
      // If authenticated, fetch user invoices
      const userInvoices = await prisma.invoice.findMany({
        where: { userId },
        include: { InvoiceItem: true },
      });

      // Check remaining invoices for the user
      const { remainingInvoices } = await limitUserInvoices(userId);

      return NextResponse.json(
        { invoices: userInvoices, remainingInvoices },
        { status: 200 }
      );
    } else {
      // For guest users, track by IP address
      const guestIp = getIp();
      if (!guestIp) {
        return NextResponse.json(
          { error: 'Unable to retrieve guest IP' },
          { status: 400 }
        );
      }

      // Fetch guest invoices by IP address and include invoice items
      const guestUsage = await prisma.guestUsage.findUnique({
        where: { ipAddress: guestIp },
        include: {
          Invoice: {
            include: {
              InvoiceItem: true, // Include the invoice items for the guest
            },
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
    console.error('Error fetching invoices:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching invoices.' },
      { status: 500 }
    );
  }
}