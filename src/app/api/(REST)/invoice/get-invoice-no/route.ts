import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { generateInvoiceNumber } from '@/utils/invoice';
import { getSession } from '@/utils/session';
import { getIp } from '@/lib/get-ip';

export async function GET(request: NextRequest) {
  try {
    // Check if the user is authenticated
    const session = await getSession();
    const userId = session?.user?.id;
    let generatedInvoiceNo;

    if (userId) {
      // If the user is authenticated, generate the next invoice number for the user
      generatedInvoiceNo = await generateInvoiceNumber();
      return NextResponse.json({ invoiceNo: generatedInvoiceNo }, { status: 200 });
    } else {
      // For guest users, track by IP address
      const guestIp = getIp();
      if (!guestIp) {
        return NextResponse.json({ error: 'Unable to retrieve guest IP' }, { status: 400 });
      }

      // Find guest usage based on IP
      let guestUsage = await prisma.guestUsage.findUnique({
        where: { ipAddress: guestIp },
      });

      // If no guestUsage exists, this is their first invoice
      if (!guestUsage) {
        generatedInvoiceNo = 'inv0001';
      } else {
        // Otherwise, generate based on the number of previous invoices
        generatedInvoiceNo = `inv${(guestUsage.invoices + 1).toString().padStart(4, '0')}`;
      }

      return NextResponse.json({ invoiceNo: generatedInvoiceNo }, { status: 200 });
    }
  } catch (error) {
    console.error('Error fetching invoice number:', error);
    return NextResponse.json({ error: 'An error occurred while fetching the invoice number.' }, { status: 500 });
  }
}