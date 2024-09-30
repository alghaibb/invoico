import prisma from "@/lib/prisma";

export async function generateInvoiceNumber() {
  // Get the current count of invoices
  const invoiceCount = await prisma.invoice.count();

  // Increment the count for the new invoice number
  const nextInvoiceNumber = invoiceCount + 1;

  // Format the number as "invXXXX" (e.g., inv0001, inv0002)
  const formattedInvoiceNumber = `inv${String(nextInvoiceNumber).padStart(4, "0")}`;

  return formattedInvoiceNumber;
}