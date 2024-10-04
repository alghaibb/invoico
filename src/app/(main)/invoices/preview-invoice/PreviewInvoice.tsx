"use client";

import { z } from "zod";
import { InvoiceCreateSchema } from "@/validations/invoice";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { IoDownloadOutline } from "react-icons/io5";
import Link from "next/link";

// Define the type for invoiceData using the Zod schema or Prisma model
type InvoiceData = z.infer<typeof InvoiceCreateSchema>;

interface PreviewInvoiceProps {
  invoice: InvoiceData;
}

const PreviewInvoice: React.FC<PreviewInvoiceProps> = ({ invoice }) => {
  const downloadPDF = async () => {
    const input = document.getElementById("invoice-preview");

    if (!input) {
      console.error("Invoice preview element not found!");
      return;
    }

    const filename = invoice.invoiceNo;

    // Dynamically import the html2pdf library
    const html2pdf = await require("html2pdf.js");

    html2pdf(input, {
      margin: 20,
      filename: `${filename}.pdf`,
      html2canvas: {
        ignoreElements: (element: { id: string }) => {
          const ignoreIds = ["download-pdf", "view-invoices"];

          return ignoreIds.includes(element.id);
        },
      },
    });
  };

  return (
    <div className="container p-6 mx-auto">
      <div id="invoice-preview" className="space-y-6">
        {/* Business and Invoice Details */}
        <h1 className="w-full text-2xl font-bold md:text-4xl">
          {invoice.invoiceTitle}
        </h1>
        <div className="flex flex-col items-start justify-between space-y-6 md:flex-row md:space-y-0">
          <div className="w-full md:w-1/2">
            <h2 className="text-xl font-semibold">{invoice.fromName}</h2>
            <p className="text-sm">{invoice.fromAddress}</p>
            <p className="text-sm">{invoice.fromEmail}</p>
            <p className="text-sm">{invoice.fromPhoneNumber}</p>
            <p className="text-sm">ABN: {invoice.abn}</p>
          </div>
          <Separator className="md:hidden" />
          <div className="w-full md:w-1/2 md:text-right">
            <h3 className="text-lg font-bold">
              Invoice Number: #{invoice.invoiceNo}
            </h3>
            <p className="text-sm">
              Date: {new Date(invoice.issueDate).toLocaleDateString()}
            </p>
            <p className="text-sm">
              Due: {new Date(invoice.dueDate).toLocaleDateString()}
            </p>
            <p className="text-lg font-semibold">
              Balance Due: AUD ${invoice.totalAmount.toFixed(2)}
            </p>
          </div>
        </div>

        <hr className="my-6" />

        {/* Client Information */}
        <div>
          <h4 className="text-lg font-bold">Bill To</h4>
          <p>{invoice.toName}</p>
          <p>{invoice.toEmail}</p>
          <p>{invoice.toPhoneNumber}</p>
          <p>{invoice.toAddress}</p>
        </div>

        <hr className="my-6" />

        {/* Items Table */}
        <div className="overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoice.items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.price.toFixed(2)}</TableCell>
                  <TableCell>{item.total.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <hr className="my-6" />

        {/* Summary of Total Amount and Tax */}
        <div className="flex flex-col items-start justify-between space-y-6 md:flex-row md:space-y-0">
          <div className="w-full md:w-1/2">
            <p>
              <strong>Subtotal:</strong> AUD $
              {(invoice.totalAmount - (invoice.taxAmount ?? 0)).toFixed(2)}
            </p>
            <p>
              <strong>GST ({invoice.taxRate}%):</strong> AUD $
              {invoice.taxAmount?.toFixed(2)}
            </p>
          </div>
          <Separator className="md:hidden" />
          <div className="w-full md:w-1/2 md:text-right">
            <h4 className="text-lg font-bold">Total Amount</h4>
            <p className="text-2xl font-semibold">
              AUD ${invoice.totalAmount.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-between mt-6 text-center md:text-right md:flex-row">
          <Button asChild id="view-invoices">
            <Link href="/invoices">View All Invoices</Link>
          </Button>
          <Button
            onClick={downloadPDF}
            className="w-full md:w-min"
            id="download-pdf"
            variant="outline"
          >
            Download PDF <IoDownloadOutline className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PreviewInvoice;
