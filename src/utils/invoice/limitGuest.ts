import { getIp } from "@/lib/get-ip";
import prisma from "@/lib/prisma";

const MAX_GUEST_INVOICES = 5;

export async function limitGuestInvoices() {
  // Get the IP address of the user
  const ip = getIp();

  if (!ip) {
    throw new Error("IP address not found");
  }

  // Find guest usage entry by IP address
  let guestUsage = await prisma.guestUsage.findUnique({
    where: { ipAddress: ip },
  });

  // If no guest usage record exists, create one
  if (!guestUsage) {
    guestUsage = await prisma.guestUsage.create({
      data: {
        ipAddress: ip,
        invoices: 0,
      },
    });
  }

  // Check if the guest has exceeded the invoice limit
  if (guestUsage.invoices >= MAX_GUEST_INVOICES) {
    throw new Error(
      "You have reached the maximum number of invoices allowed. Please register to create more invoices."
    );
  }

  // If not exceeded, allow the creation of another invoice and increment the count
  await prisma.guestUsage.update({
    where: { id: guestUsage.id },
    data: { invoices: { increment: 1 } },
  });

  return true;
}