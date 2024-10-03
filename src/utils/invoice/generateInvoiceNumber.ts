import prisma from "@/lib/prisma";

// Generate invoice number for registered users
export async function generateInvoiceNumberForUser(userId: string) {
  // Get the count of invoices for the user
  const userInvoiceCount = await prisma.invoice.count({
    where: { userId },
  });

  // Increment the count for the new invoice number
  const nextInvoiceNumber = userInvoiceCount + 1;

  // Format the number as "invXXXX" (e.g., inv0001, inv0002)
  const formattedInvoiceNumber = `inv${String(nextInvoiceNumber).padStart(4, "0")}`;

  return formattedInvoiceNumber;
}

// Generate invoice number for guests (based on IP)
export async function generateInvoiceNumberForGuest(guestIp: string) {
  // Retrieve the guest's usage based on the IP address
  let guestUsage = await prisma.guestUsage.findUnique({
    where: { ipAddress: guestIp },
    select: { invoices: true }, // Retrieve only the invoice count
  });

  // If no guest usage exists, this is their first invoice
  if (!guestUsage) {
    return 'inv0001';
  }

  // Increment the invoice count for the guest
  const nextInvoiceNumber = guestUsage.invoices + 1;

  // Format the number as "invXXXX" (e.g., inv0001, inv0002)
  const formattedInvoiceNumber = `inv${String(nextInvoiceNumber).padStart(4, "0")}`;

  return formattedInvoiceNumber;
}
