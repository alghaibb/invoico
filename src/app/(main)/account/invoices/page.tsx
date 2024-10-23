import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { getSession } from "@/utils/session";

import InvoiceCards from "./InvoiceCards";

export const metadata: Metadata = {
  title: "My Invoices | Account",
};

export default async function AccountInvoicesPage() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/login");
  }

  // Fetch the invoices for the logged-in user
  const invoices = await prisma.invoice.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="flex flex-col items-center min-h-screen p-6 space-y-6 bg-muted">
      <div className="w-full max-w-4xl space-y-4">
        <h1 className="text-3xl font-bold text-center md:text-left">
          My Invoices
        </h1>

        {invoices.length === 0 ? (
          <p className="text-center text-muted-foreground">
            No invoices found.{" "}
            <Button asChild variant="link">
              <Link
                href="/invoices/new-invoice"
                className="underline text-primary"
              >
                Create Your First Invoice
              </Link>
            </Button>
            .
          </p>
        ) : (
          <InvoiceCards invoices={invoices} />
        )}
      </div>
    </div>
  );
}
