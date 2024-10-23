"use client";

import { Invoice } from "@prisma/client";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatDate, formatCurrency } from "@/utils/format";

type InvoiceCardsProps = {
  invoices: Invoice[];
};

const InvoiceStatusBadge = ({ status }: { status: string }) => {
  const variant =
    status === "PAID"
      ? "bg-green-100 text-green-700"
      : status === "OVERDUE"
        ? "bg-red-100 text-red-700"
        : "bg-yellow-100 text-yellow-700";

  return (
    <span className={cn("px-2 py-1 rounded-full text-sm font-medium", variant)}>
      {status}
    </span>
  );
};

export default function InvoiceCards({ invoices }: InvoiceCardsProps) {
  // Calculate total invoices and total amount
  const totalInvoices = invoices.length;
  const totalAmount = invoices.reduce(
    (acc, invoice) => acc + invoice.totalAmount,
    0
  );

  return (
    <div className="space-y-6">
      {/* Summary statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="p-4 transition-shadow bg-white rounded-lg shadow-md hover:shadow-lg">
          <h3 className="text-xl font-bold">Total Invoices</h3>
          <p className="text-3xl font-semibold">{totalInvoices}</p>
        </div>
        <div className="p-4 transition-shadow bg-white rounded-lg shadow-md hover:shadow-lg">
          <h3 className="text-xl font-bold">Total Amount Made</h3>
          <p className="text-3xl font-semibold">
            {formatCurrency(totalAmount)}
          </p>
        </div>
        <div className="p-4 transition-shadow bg-white rounded-lg shadow-md hover:shadow-lg">
          <h3 className="text-xl font-bold">Status Overview</h3>
          <p className="text-sm">
            {invoices.filter((invoice) => invoice.status === "PAID").length}{" "}
            Paid,{" "}
            {invoices.filter((invoice) => invoice.status === "OVERDUE").length}{" "}
            Overdue
          </p>
        </div>
      </div>

      {/* Invoices list */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {invoices.map((invoice) => (
          <div
            key={invoice.id}
            className="p-4 space-y-2 transition-shadow bg-white rounded-lg shadow-md hover:shadow-lg"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">#{invoice.invoiceNo}</h3>
              <InvoiceStatusBadge status={invoice.status} />
            </div>

            <p className="text-sm text-muted-foreground">
              Client: {invoice.toName || "N/A"}
            </p>
            <p className="text-sm text-muted-foreground">
              Due Date: {formatDate(invoice.dueDate)}
            </p>
            <p className="text-sm text-muted-foreground">
              Amount: {formatCurrency(invoice.totalAmount)}
            </p>
            <p className="text-sm text-muted-foreground">
              GST: {invoice.taxRate}%
            </p>

            <Link href={`/invoices/preview-invoice/${invoice.id}`}>
              <Button variant="outline" size="sm" className="w-full mt-2">
                View Details
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
