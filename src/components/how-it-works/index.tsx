import { getRecentInvoices } from "@/utils/invoice/getRecentInvoices";
import { getSession } from "@/utils/session";

import HowItWorks from "./how-it-works";

export default async function HowItWorksServer() {
  const session = await getSession();
  const userId = session?.user?.id;

  let isLoggedIn = false;
  let hasInvoices = false;

  if (userId) {
    isLoggedIn = true;
    const invoices = await getRecentInvoices(userId, 1);
    hasInvoices = invoices.length > 0;
  }

  return <HowItWorks isLoggedIn={isLoggedIn} hasInvoices={hasInvoices} />;
}
