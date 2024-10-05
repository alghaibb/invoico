import { NextRequest, NextResponse } from 'next/server';

import { getIp } from '@/lib/get-ip';
import prisma from '@/lib/prisma';
import { getSession } from '@/utils/session';

export const dynamic = 'force-dynamic';

export async function PATCH(req: NextRequest, { params }: { params: { invoiceId: string } }) {
  const invoiceId = params.invoiceId;
  const { status: newStatus } = await req.json(); // Get the updated status from the request body

  try {
    // Get the current session and user ID
    const session = await getSession();
    const userId = session?.user?.id || null;

    // Check if the invoice exists
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      select: { userId: true, guestId: true, status: true }, // Include current status in the selection
    });

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    // Check if the new status is the same as the current status
    if (invoice.status === newStatus) {
      return NextResponse.json({ error: `Invoice is already marked as ${newStatus}.` }, { status: 400 });
    }

    // If the invoice belongs to a guest, check if the request came from a guest
    if (invoice.guestId) {
      const ip = getIp() || req.ip; // Get guest's IP address
      const guestUsage = await prisma.guestUsage.findUnique({
        where: { ipAddress: ip },
      });

      if (!guestUsage || guestUsage.id !== invoice.guestId) {
        return NextResponse.json({ error: 'You do not have permission to update this guest invoice.' }, { status: 403 });
      }

      // Guest is authenticated, so proceed to update the guest's invoice status
      await prisma.invoice.update({
        where: { id: invoiceId },
        data: { status: newStatus },
      });

      return NextResponse.json({ success: 'Invoice status updated successfully' }, { status: 200 });
    }

    // If the invoice belongs to a registered user, ensure the current user has permission
    if (invoice.userId) {
      if (!userId || invoice.userId !== userId) {
        return NextResponse.json({ error: 'You do not have permission to update this invoice.' }, { status: 403 });
      }

      // Authenticated user is allowed, so proceed to update the user's invoice status
      await prisma.invoice.update({
        where: { id: invoiceId },
        data: { status: newStatus },
      });

      return NextResponse.json({ success: 'Invoice status updated successfully' }, { status: 200 });
    }

    // If neither, return error
    return NextResponse.json({ error: 'Invalid invoice or permission issue' }, { status: 403 });
  } catch (error) {
    console.error('Error updating invoice status:', error);
    return NextResponse.json({ error: 'An error occurred while updating the invoice status' }, { status: 500 });
  }
}
