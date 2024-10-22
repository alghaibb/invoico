import prisma from "@/lib/prisma";
import { getSession } from "@/utils/session";

import InvoiceTable from "./InvoiceTable";

export default async function InvoiceTablePage() {
  const session = await getSession(); // Fetch session data
  const userId = session?.user?.id || null;
  const isGuestInitial = !userId;
  const pageSize = 10;
  const currentPage = 1;

  // Fetch the initial invoice data on the server
  const invoices = await prisma.invoice.findMany({
    where: {
      userId: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    skip: (currentPage - 1) * pageSize,
    take: pageSize,
  });

  // Count the total number of invoices for pagination
  const totalInvoices = await prisma.invoice.count({
    where: {
      userId: userId,
    },
  });

  const totalPages = Math.ceil(totalInvoices / pageSize);

  return (
    <InvoiceTable
      initialInvoices={invoices}
      totalPages={totalPages}
      currentPage={currentPage}
      initialTotalInvoices={totalInvoices}
    />
  );
}
