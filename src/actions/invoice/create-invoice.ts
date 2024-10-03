"use server"

import prisma from "@/lib/prisma";
import { generateInvoiceNumberForGuest, generateInvoiceNumberForUser, limitGuestInvoices, limitUserInvoices } from "@/utils/invoice";
import { InvoiceCreateSchema } from "@/validations/invoice";
import { actionClient } from "@/lib/safe-action";
import { flattenValidationErrors } from "next-safe-action";
import { getSession } from "@/utils/session";
import { getIp } from "@/lib/get-ip";

export const createInvoice = actionClient
  .schema(InvoiceCreateSchema, {
    handleValidationErrorsShape: (ve) => flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput }) => {
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
      taxRate,
      taxAmount,
      items,
    } = parsedInput;

    try {
      let generatedInvoiceNo;

      // Check if the user is logged in (registered user)
      const session = await getSession();
      const userId = session?.user?.id;

      if (userId) {
        // Limit invoice creation for registered users
        await limitUserInvoices(userId);

        // Generate an invoice number if not provided
        generatedInvoiceNo = invoiceNo || `USER-${await generateInvoiceNumberForUser(userId)}`;

        // Create the invoice for a registered user
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
            taxRate: taxRate,
            taxAmount: taxAmount || null,
            InvoiceItem: {
              create: items.map(item => ({
                description: item.description,
                quantity: item.quantity,
                price: item.price,
                total: item.total,
              })),
            },
            userId, // Link the invoice to the registered user
          },
        });

        return { success: "Invoice successfully created", invoice };
      } else {
        // If the user is a guest, enforce guest invoice limits
        try {
          await limitGuestInvoices();
        } catch (error) {
          console.error("Guest invoice limit reached", error);
          return {
            error: "You have reached the maximum number of invoices allowed. Please create an account to create more invoices.",
          };
        }

        // Get the guest's IP address to track their invoices
        const guestIp = getIp();
        if (!guestIp) {
          throw new Error("Unable to retrieve guest IP");
        }

        // Generate an invoice number if not provided
        generatedInvoiceNo = invoiceNo || `GUEST-${await generateInvoiceNumberForGuest(guestIp)}`;

        // Ensure the GuestUsage record exists for the guest IP
        let guestUsage = await prisma.guestUsage.findUnique({
          where: { ipAddress: guestIp },
        });

        // If it doesn't exist, create it
        if (!guestUsage) {
          guestUsage = await prisma.guestUsage.create({
            data: {
              ipAddress: guestIp,
              invoices: 0, // Initial invoice count
            },
          });
        }

        // Create the invoice for the guest user
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
            taxRate: taxRate,
            taxAmount: taxAmount || null,
            InvoiceItem: {
              create: items.map(item => ({
                description: item.description,
                quantity: item.quantity,
                price: item.price,
                total: item.total,
              })),
            },
            guestId: guestUsage.id, // Link the invoice to the GuestUsage record
          },
        });

        return { success: "Invoice successfully created", invoice };
      }
    } catch (error) {
      console.error("Error in createInvoice action: ", error);
      return { error: "An error occurred while creating your invoice. Please try again." };
    }
  });
