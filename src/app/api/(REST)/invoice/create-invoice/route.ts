import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { generateInvoiceNumber, limitGuestInvoices, limitUserInvoices } from '@/utils/invoice';
import { InvoiceCreateSchema } from '@/validations/invoice';
import { getSession } from '@/utils/session';
import { getIp } from '@/lib/get-ip';

export async function POST(request: NextRequest) {
  try {
    // Parse the JSON body
    const body = await request.json();

    // Validate input using Zod schema
    const parsedInput = InvoiceCreateSchema.safeParse(body);
    if (!parsedInput.success) {
      return NextResponse.json({ error: parsedInput.error }, { status: 400 });
    }
    const {
      invoiceNo,
      invoiceTitle,
      fromName,
      fromEmail,
      fromAddress,
      fromPhoneNumber,
      abn,
      toName,
      toEmail,
      toAddress,
      toPhoneNumber,
      toMobile,
      toFax,
      issueDate,
      dueDate,
      status,
      totalAmount,
      taxAmount,
      items,
    } = parsedInput.data;

    let generatedInvoiceNo;
    const session = await getSession();
    const userId = session?.user?.id;

    if (userId) {
      // Handle registered user invoice creation
      await limitUserInvoices(userId);
      generatedInvoiceNo = invoiceNo || await generateInvoiceNumber();

      const invoice = await prisma.invoice.create({
        data: {
          invoiceNo: generatedInvoiceNo,
          invoiceTitle,
          fromName,
          fromEmail,
          fromAddress,
          fromPhoneNumber: fromPhoneNumber || null,
          abn: abn || null,
          toName,
          toEmail,
          toAddress,
          toPhoneNumber: toPhoneNumber || null,
          toMobile: toMobile || null,
          toFax: toFax || null,
          issueDate,
          dueDate,
          status,
          totalAmount,
          taxAmount: taxAmount || null,
          InvoiceItem: {
            create: items.map(item => ({
              description: item.description,
              quantity: item.quantity,
              price: item.price,
              total: item.total,
            })),
          },
          userId,
        },
      });

      return NextResponse.json({ success: 'Invoice successfully created', invoice }, { status: 201 });
    } else {
      // Handle guest invoice creation with IP tracking
      await limitGuestInvoices();

      generatedInvoiceNo = invoiceNo || await generateInvoiceNumber();
      const guestIp = getIp();
      if (!guestIp) {
        return NextResponse.json({ error: 'Unable to retrieve guest IP' }, { status: 400 });
      }

      // Find or create GuestUsage entry for this IP
      let guestUsage = await prisma.guestUsage.findUnique({
        where: { ipAddress: guestIp },
      });

      if (!guestUsage) {
        guestUsage = await prisma.guestUsage.create({
          data: { ipAddress: guestIp, invoices: 0 },
        });
      }

      const invoice = await prisma.invoice.create({
        data: {
          invoiceNo: generatedInvoiceNo,
          invoiceTitle,
          fromName,
          fromEmail,
          fromAddress,
          fromPhoneNumber: fromPhoneNumber || null,
          abn: abn || null,
          toName,
          toEmail,
          toAddress,
          toPhoneNumber: toPhoneNumber || null,
          toMobile: toMobile || null,
          toFax: toFax || null,
          issueDate,
          dueDate,
          status,
          totalAmount,
          taxAmount: taxAmount || null,
          InvoiceItem: {
            create: items.map(item => ({
              description: item.description,
              quantity: item.quantity,
              price: item.price,
              total: item.total,
            })),
          },
          guestId: guestUsage.id,
        },
      });

      return NextResponse.json({ success: 'Invoice successfully created', invoice }, { status: 201 });
    }
  } catch (error) {
    console.error('Error in invoice creation:', error);
    return NextResponse.json({ error: 'An error occurred while creating your invoice. Please try again.' }, { status: 500 });
  }
}
