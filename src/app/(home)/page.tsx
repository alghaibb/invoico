import FaqSection from "@/components/faq";
import Hero from "@/components/hero";
import HowItWorks from "@/components/how-it-works";
import { getIp } from "@/lib/get-ip";
import prisma from "@/lib/prisma";
import { getSession } from "@/utils/session";

export default async function Home() {
  const session = await getSession();
  const user = session?.user.id || null;

  const guestIp = getIp();

  // Find invoices for logged-in users
  const userInvoices = await prisma.invoice.findMany({
    where: {
      userId: user, // Logged-in user invoices
    },
  });

  // Find guest usage for the current guest IP
  const guestUsage = await prisma.guestUsage.findFirst({
    where: {
      ipAddress: guestIp as string, // Guest usage invoices
    },
  });

  // Check if either the user has invoices or the guest has used the invoicing system
  const hasInvoice = userInvoices.length > 0 || guestUsage !== null;

  return (
    <div>
      <Hero hasInvoice={hasInvoice} />
      <HowItWorks />
      <FaqSection />
    </div>
  );
}
