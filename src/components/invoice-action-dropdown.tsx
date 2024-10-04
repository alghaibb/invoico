"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Loader2 } from "lucide-react";

// Reusable component for the three-dot action menu
const InvoiceActionsDropdown = ({ invoiceId }: { invoiceId: string }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleViewInvoice = () => {
    router.push(`/invoices/preview-invoice/${invoiceId}`);
  };

  const handleEmailInvoice = () => {
    // Logic to send invoice via email
    console.log(`Sending email for invoice ${invoiceId}`);
  };

  const handleDownloadPDF = () => {
    // Logic to download the invoice as PDF
    console.log(`Downloading PDF for invoice ${invoiceId}`);
  };

  const handleDeleteInvoice = async () => {
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/invoice/delete-invoice/${invoiceId}`, {
        method: "DELETE",
      });

      const result = await res.json();

      if (res.ok) {
        router.push("invoices");
        window.location.href = "/invoices";
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete invoice.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while deleting the invoice.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
      <div className="relative">
      {/* Loading overlay */}
      {isDeleting && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center justify-center p-2 rounded-md hover:bg-gray-100 focus:outline-none">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" align="end">
          <DropdownMenuItem onSelect={handleViewInvoice}>
            View Invoice
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={handleEmailInvoice}>
            Email Invoice
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={handleDownloadPDF}>
            Download PDF
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <button
              className="w-full text-red-600 hover:text-red-700 focus:text-red-700"
              onClick={handleDeleteInvoice}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Invoice"}
            </button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default InvoiceActionsDropdown;
