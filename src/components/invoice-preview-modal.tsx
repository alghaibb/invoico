"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
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

// Define the type for invoiceData using the Zod schema
type InvoiceData = z.infer<typeof InvoiceCreateSchema>;

interface InvoicePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoiceData: InvoiceData;
}

const InvoicePreviewModal: React.FC<InvoicePreviewModalProps> = ({
  isOpen,
  onClose,
  invoiceData,
}) => {
  // Function to download the invoice as PDF
  const downloadPDF = async () => {
    const input = document.getElementById("invoice-preview");

    if (!input) {
      console.error("Invoice preview element not found!");
      return;
    }

    // Dynamically import the html2pdf library
    const html2pdf = await require("html2pdf.js");

    html2pdf(input, {
      margin: 20,
      filename: `${invoiceData.invoiceNo}.pdf`,
    });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      {/* Allow scroll within the modal */}
      <AlertDialogContent className="w-full max-w-4xl mx-auto h-screen md:h-auto overflow-auto p-4 md:p-6">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl font-bold">
            Invoice Preview
          </AlertDialogTitle>
        </AlertDialogHeader>

        {/* Add an ID to capture the preview */}
        <div
          id="invoice-preview"
          className="space-y-6 max-h-full overflow-y-auto md:overflow-hidden"
        >
          {/* Business and Invoice Details */}
          <div className="flex flex-col md:flex-row justify-between items-start">
            {/* Business Information */}
            <div className="w-full md:w-1/2">
              <h2 className="text-xl font-semibold">{invoiceData.fromName}</h2>
              <p className="text-sm">{invoiceData.fromAddress}</p>
              <p className="text-sm">{invoiceData.fromEmail}</p>
              <p className="text-sm">{invoiceData.fromPhoneNumber}</p>
              <p className="text-sm">ABN: {invoiceData.abn}</p>
            </div>

            {/* Invoice Details */}
            <div className="w-full md:w-1/2 text-right mt-4 md:mt-0">
              <h3 className="text-lg font-bold">
                Invoice #{invoiceData.invoiceNo}
              </h3>
              <p className="text-sm">
                Date: {new Date(invoiceData.issueDate).toLocaleDateString()}
              </p>
              <p className="text-sm">
                Due: {new Date(invoiceData.dueDate).toLocaleDateString()}
              </p>
              <p className="text-lg font-semibold">
                Balance Due: AUD ${invoiceData.totalAmount.toFixed(2)}
              </p>
            </div>
          </div>

          <hr className="my-6" />

          {/* Client Information */}
          <div>
            <h4 className="font-bold text-lg">Bill To</h4>
            <p>{invoiceData.toName}</p>
            <p>{invoiceData.toEmail}</p>
            <p>{invoiceData.toPhoneNumber}</p>
            <p>{invoiceData.toAddress}</p>
          </div>

          <hr className="my-6" />

          {/* Items Table */}
          <div className="space-y-4">
            <Table className="w-full text-left">
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoiceData.items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>${item.price.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      ${item.total.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <hr className="my-6" />

          {/* Summary of Total Amount and Tax */}
          <div className="flex justify-between items-center">
            <div>
              <p>
                <strong>Subtotal:</strong> AUD $
                {(
                  invoiceData.totalAmount - (invoiceData.taxAmount ?? 0)
                ).toFixed(2)}
              </p>
              <p>
                <strong>GST ({invoiceData.taxRate}%):</strong> AUD $
                {invoiceData.taxAmount?.toFixed(2)}
              </p>
            </div>
            <div className="text-right">
              <h4 className="font-bold text-lg">Total Amount</h4>
              <p className="text-2xl font-semibold">
                AUD ${invoiceData.totalAmount.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Close</AlertDialogCancel>
          <Button onClick={downloadPDF}>Download PDF</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default InvoicePreviewModal;
