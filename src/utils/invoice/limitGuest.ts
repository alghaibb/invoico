import { getIp } from "@/lib/get-ip";
import prisma from "@/lib/prisma";

const MAX_GUEST_INVOICES = parseInt(process.env.MAX_GUEST_INVOICES || "5", 10);

export async function limitGuestInvoices() {
  // Get the IP address of the user
  const ip = getIp();

  if (!ip) {
    throw new Error("IP address not found");
  }

  // Find guest usage by IP address
  const guestUsage = await prisma.guestUsage.findUnique({
    where: { ipAddress: ip },
  });

  // Calculate remaining invoices for the guest based on existing usage
  const remainingInvoices = guestUsage
    ? MAX_GUEST_INVOICES - guestUsage.invoices
    : MAX_GUEST_INVOICES;

  // If the guest has reached their invoice limit
  if (remainingInvoices <= 0) {
    return {
      success: false,
      error:
        "You have reached the maximum number of invoices allowed. Please create an account to create more invoices.",
      remainingInvoices: 0,
    };
  }

  return { success: true, remainingInvoices };
}
