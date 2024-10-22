"use client";

import { Invoice } from "@prisma/client";
import Link from "next/link";
import { useEffect } from "react";
import { CiCirclePlus } from "react-icons/ci";

import { Message } from "@/components/custom-message";
import InvoiceActionsDropdown from "@/components/invoice/invoice-action-dropdown";
import { InvoiceFilters } from "@/components/invoice/invoice-filters";
import { RemainingInvoicesMessage } from "@/components/invoice/remaining-invoices-message";
import { LoadingDots } from "@/components/loading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import useInvoiceData from "@/hooks/use-invoice-data";
import { cn } from "@/lib/utils";
import { useFilter } from "@/providers/FilterProvider";
import { formatCurrency, formatDate } from "@/utils/format";

type InvoiceTableProps = {
  initialInvoices: Invoice[];
  totalPages: number;
  currentPage: number;
  initialTotalInvoices: number;
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

export default function InvoiceTable({
  initialInvoices,
  totalPages,
  currentPage,
  initialTotalInvoices,
}: InvoiceTableProps) {
  const {
    invoices,
    remainingInvoices,
    page,
    setPage,
    isGuest,
    errorMessage,
    loading,
    setInvoiceData,
  } = useInvoiceData();

  const { status, sortBy, sortOrder } = useFilter();

  // Set initial data from server
  useEffect(() => {
    setInvoiceData({
      invoices: initialInvoices,
      remainingInvoices: null,
      totalInvoices: initialTotalInvoices,
      planType: null,
      isGuest: false,
      errorMessage: null,
      loading: false,
    });
  }, [initialInvoices, initialTotalInvoices, setInvoiceData]);

  // Calculate the total amount paid from invoices
  const totalPaidAmount = invoices
    .filter((invoice) => invoice.status === "PAID")
    .reduce((acc, invoice) => acc + invoice.totalAmount, 0);

  const handleCreateInvoiceClick = () => {
    setInvoiceData((prevState) => ({ ...prevState, remainingInvoices: null }));

    if (remainingInvoices === 0) {
      const message = isGuest
        ? "You've hit your limit. Please create an account to create more invoices."
        : "You've hit your limit. Please upgrade your plan to create more invoices.";
      setInvoiceData((prevState) => ({
        ...prevState,
        errorMessage: message,
      }));
    }
  };

  // Apply filtering and sorting based on status, sortBy, and sortOrder
  const filteredAndSortedInvoices = invoices
    .filter((invoice) => status === "ALL" || invoice.status === status)
    .sort((a, b) => {
      const fieldA = sortBy === "date" ? new Date(a.dueDate) : a.totalAmount;
      const fieldB = sortBy === "date" ? new Date(b.dueDate) : b.totalAmount;
      return (sortOrder === "asc" ? 1 : -1) * (fieldA > fieldB ? 1 : -1);
    });

  if (loading) {
    return <LoadingDots />;
  }

  return (
    <div className="container p-6 mx-auto">
      {remainingInvoices !== null && (
        <RemainingInvoicesMessage
          remainingInvoices={remainingInvoices}
          isGuest={isGuest}
        />
      )}

      {errorMessage && <Message type="error" message={errorMessage} />}

      <div className="flex flex-col items-center justify-between gap-4 mb-6 md:flex-row md:gap-0">
        <h1 className="text-3xl font-semibold">Your Invoices</h1>
        <Link
          href={(remainingInvoices ?? 0) > 0 ? "/invoices/new-invoice" : "#"}
          onClick={
            (remainingInvoices ?? 0) === 0
              ? handleCreateInvoiceClick
              : undefined
          }
        >
          <Button variant="ghost" className="flex items-center">
            Create New Invoice <CiCirclePlus className={cn(`w-5 h-5 ml-2`)} />
          </Button>
        </Link>
      </div>

      <div className="flex items-center justify-between px-4 py-4 mb-4 bg-muted">
        <h2 className="text-xl font-semibold">
          Total Paid Amount: {formatCurrency(totalPaidAmount)}
        </h2>
      </div>

      <Separator className="my-6" />

      <InvoiceFilters />

      <Separator className="my-6" />

      {filteredAndSortedInvoices.length === 0 ? (
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
                <TableHead>Balance Due</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedInvoices.map((invoice) => (
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
                  <TableCell>
                    {invoice.status === "PAID"
                      ? formatCurrency(0)
                      : formatCurrency(invoice.totalAmount)}
                  </TableCell>
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

      <Pagination className="w-full mt-14">
        <PaginationContent className="flex justify-center space-x-4">
          {" "}
          {/* Added space between items */}
          {/* Previous Page Button */}
          <PaginationItem>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (page > 1) {
                  setPage(page - 1);
                }
              }}
              className={cn(
                "px-10 py-2",
                page === 1 && "cursor-not-allowed text-muted"
              )}
            >
              Previous
            </PaginationLink>
          </PaginationItem>
          {/* Page Numbers */}
          {Array.from({ length: totalPages }, (_, index) => (
            <PaginationItem key={index}>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setPage(index + 1);
                }}
                isActive={currentPage === index + 1}
                className="px-4 py-2"
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          {/* Next Page Button */}
          <PaginationItem>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (page < totalPages) {
                  setPage(page + 1);
                }
              }}
              className={cn(
                "px-10 py-2",
                page === totalPages && "cursor-not-allowed text-muted"
              )}
            >
              Next
            </PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
