"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CiCirclePlus } from "react-icons/ci";

import { Message } from "@/components/custom-message";
import InvoiceActionsDropdown from "@/components/invoice-action-dropdown";
import { InvoiceFilters } from "@/components/invoice-filters";
import { LoadingDots } from "@/components/loading";
import { RemainingInvoicesMessage } from "@/components/remaining-invoices-message";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { useFilter } from "@/providers/FilterProvider";
import { formatCurrency, formatDate } from "@/utils/format";

type InvoiceItem = {
  description: string;
  quantity: number;
  price: number;
  total: number;
};

type Invoice = {
  id: string;
  invoiceNo: string;
  toName: string;
  toEmail: string;
  dueDate: string;
  totalAmount: number;
  status: "PENDING" | "PAID" | "OVERDUE";
  InvoiceItem: InvoiceItem[];
};

type PlanType = {
  type: string;
  invoiceLimit: number;
};

type ApiResponse = {
  invoices: Invoice[];
  remainingInvoices: number | null;
  plan?: PlanType;
};

// Fetch invoices from API
const fetchInvoices = async () => {
  const res = await fetch("/api/invoice/get-invoices");
  if (!res.ok) throw new Error("Failed to fetch invoices");
  return res.json();
};

// Badge component for displaying invoice status
const InvoiceStatusBadge = ({ status }: { status: string }) => {
  const variant =
    status === "PAID"
      ? "paid"
      : status === "OVERDUE"
      ? "destructive"
      : "outline";

  return <Badge variant={variant}>{status}</Badge>;
};

export default function InvoiceTable() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [remainingInvoices, setRemainingInvoices] = useState<number | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);
  const [planType, setPlanType] = useState<string | null>(null);

  const { status, sortBy, sortOrder } = useFilter();

  useEffect(() => {
    const loadInvoices = async () => {
      try {
        const { invoices, remainingInvoices, plan } = await fetchInvoices();
        setInvoices(invoices);
        setRemainingInvoices(remainingInvoices);
        setIsGuest(!plan);
        setPlanType(plan?.type || null);
      } catch (error) {
        console.error("Error loading invoices:", error);
      } finally {
        setLoading(false);
      }
    };

    loadInvoices();
  }, []);

  // Apply filtering and sorting based on status, sortBy, and sortOrder
  const filteredInvoices = invoices.filter((invoice) =>
    status === "ALL" ? true : invoice.status === status
  );

  const sortedInvoices = filteredInvoices.sort((a, b) => {
    const fieldA = sortBy === "date" ? new Date(a.dueDate) : a.totalAmount;
    const fieldB = sortBy === "date" ? new Date(b.dueDate) : b.totalAmount;

    return sortOrder === "asc"
      ? fieldA > fieldB
        ? 1
        : -1
      : fieldA < fieldB
      ? 1
      : -1;
  });

  if (loading) {
    return <LoadingDots />;
  }

  return (
    <div className="container p-6 mx-auto">
      {/* Remaining invoices message */}
      {remainingInvoices !== null && (
        <RemainingInvoicesMessage
          remainingInvoices={remainingInvoices}
          isGuest={isGuest}
        />
      )}

      {/* Button and heading wrapper */}
      <div className="flex flex-col items-center justify-between gap-4 mb-6 md:flex-row md:gap-0">
        <h1 className="text-3xl font-semibold">Your Invoices</h1>
        <Button variant="ghost" asChild className="flex items-center">
          <Link href="/invoices/new-invoice" className="flex items-center">
            Create New Invoice <CiCirclePlus className="w-5 h-5 ml-2" />
          </Link>
        </Button>
      </div>

      {/* Filters Component */}
      <InvoiceFilters />

      <Separator className="my-6" />

      {sortedInvoices.length === 0 ? (
        <div className="text-center">
          <p className="text-lg text-muted-foreground">No invoices found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table className="min-w-full table-auto">
            <TableHeader>
              <TableRow>
                <TableHead>Invoice Number</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedInvoices.map((invoice) => (
                <TableRow key={invoice.invoiceNo}>
                  <TableCell>#{invoice.invoiceNo}</TableCell>
                  <TableCell className="whitespace-nowrap">
                    <div className="flex flex-col">
                      {invoice.toName}
                      <span className="text-sm text-muted-foreground">
                        {invoice.toEmail}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(invoice.dueDate)}</TableCell>
                  <TableCell>{formatCurrency(invoice.totalAmount)}</TableCell>
                  <TableCell>
                    <InvoiceStatusBadge status={invoice.status} />
                  </TableCell>
                  <TableCell>
                    <InvoiceActionsDropdown
                      invoiceId={invoice.id}
                      initialStatus={invoice.status}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
