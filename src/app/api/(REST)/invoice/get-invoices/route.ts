export const dynamic = 'force-dynamic';

import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { getIp } from "@/lib/get-ip";
import { getSession } from "@/utils/session";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    const userId = session?.user?.id;

    if (userId) {
      // If user is authenticate, fetch invoices for the user
      const userInvoices = await prisma.invoice.findMany({
        where: { userId },
        include: { InvoiceItem: true },
      });

      return NextResponse.json({ invoices: userInvoices }, { status: 200 });
    } else {
      // For guest users, track by IP address
      const guestIp = getIp();
      if (!guestIp) {
        return NextResponse.json({ error: 'Unable to retrieve guest IP' }, { status: 400 });
      }

      // Fetch guest invoices by IP address and include invoice items
      const guestUsage = await prisma.guestUsage.findUnique({
        where: { ipAddress: guestIp },
        include: {
          Invoice: {
            include: {
              InvoiceItem: true, // Including the invoice items for the guest
            },
          },
        },
      });

      return NextResponse.json({ invoices: guestUsage?.Invoice || [] }, { status: 200 });
    }
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json({ error: 'An error occurred while fetching invoices.' }, { status: 500 });
  }
}