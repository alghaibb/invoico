import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { generateInvoiceNumberForGuest, generateInvoiceNumberForUser } from '@/utils/invoice';
import { getSession } from '@/utils/session';
import { getIp } from '@/lib/get-ip';

// Dynamically render the api route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Check if the user is authenticated
    const session = await getSession();
    const userId = session?.user?.id;
    let generatedInvoiceNo;

    if (userId) {
      // If the user is authenticated, generate the next invoice number for the user
      generatedInvoiceNo = await generateInvoiceNumberForUser(userId);
      return NextResponse.json({ invoiceNo: generatedInvoiceNo }, { status: 200 });
    } else {
      // For guest users, track by IP address
      const guestIp = getIp();
      if (!guestIp) {
        return NextResponse.json({ error: 'Unable to retrieve guest IP' }, { status: 400 });
      }

      // Generate the next invoice number for the guest
      generatedInvoiceNo = await generateInvoiceNumberForGuest(guestIp);

      return NextResponse.json({ invoiceNo: generatedInvoiceNo }, { status: 200 });
    }
  } catch (error) {
    console.error('Error fetching invoice number:', error);
    return NextResponse.json({ error: 'An error occurred while fetching the invoice number.' }, { status: 500 });
  }
}