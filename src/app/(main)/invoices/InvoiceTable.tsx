"use client";

import Link from "next/link";
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
  PaginationNext,
  PaginationPrevious,
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
  const {
    invoices,
    remainingInvoices,
    totalPages,
    page,
    setPage,
    isGuest,
    errorMessage,
    loading,
    setInvoiceData,
  } = useInvoiceData();

  const { status, sortBy, sortOrder } = useFilter();

  const handleCreateInvoiceClick = () => {
    setInvoiceData((prevState) => ({ ...prevState, remainingInvoices: null }));

    if (remainingInvoices === 0) {
      if (isGuest) {
        setInvoiceData((prevState) => ({
          ...prevState,
          errorMessage: `You've hit your limit. Please create an account to create more invoices.`,
        }));
      } else {
        setInvoiceData((prevState) => ({
          ...prevState,
          errorMessage: `You've hit your limit. Please upgrade your plan to create more invoices.`,
        }));
      }
    }
  };

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

      {/* Error message if clicked and no remaining invoices */}
      {errorMessage && <Message type="error" message={errorMessage} />}

      {/* Button and heading wrapper */}
      <div className="flex flex-col items-center justify-between gap-4 mb-6 md:flex-row md:gap-0">
        <h1 className="text-3xl font-semibold">Your Invoices</h1>
        <Button
          variant="ghost"
          asChild
          className="flex items-center"
          onClick={handleCreateInvoiceClick}
          disabled={remainingInvoices === 0}
        >
          <Link
            href={
              remainingInvoices && remainingInvoices > 0
                ? "/invoices/new-invoice"
                : "#"
            }
          >
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

      {/* Pagination */}
      <Pagination className="w-full mt-14">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                if (page === 1)
                  e.preventDefault(); // Disable if it's the first page
                else setPage(page - 1);
              }}
              className={cn(
                page === 1 ? "cursor-not-allowed text-gray-400" : ""
              )} // Style it as disabled
            />
          </PaginationItem>

          {Array.from({ length: totalPages }, (_, index) => (
            <PaginationItem key={index}>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setPage(index + 1);
                }}
                isActive={page === index + 1}
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                if (page === totalPages)
                  e.preventDefault(); // Disable if it's the last page
                else setPage(page + 1);
              }}
              className={cn(
                page === totalPages ? "cursor-not-allowed text-gray-400" : ""
              )}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
