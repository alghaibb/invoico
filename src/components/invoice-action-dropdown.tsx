"use client";

import { InvoiceStatus } from "@prisma/client";
import { MoreHorizontal, Loader2, CheckCircle, Circle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useLoadingStore } from "@/stores/loadingStore";

import ConfirmDeleteDialog from "./confirm-delete-dialog";

// Reusable component for the three-dot action menu
const InvoiceActionsDropdown = ({
  invoiceId,
  initialStatus,
}: {
  invoiceId: string;
  initialStatus: InvoiceStatus;
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [status, setStatus] = useState<InvoiceStatus>(
    initialStatus as InvoiceStatus
  );
  const { toast } = useToast();
  const router = useRouter();
  const setLoading = useLoadingStore((state) => state.setLoading);

  const handleViewInvoice = () => {
    router.push(`/invoices/preview-invoice/${invoiceId}`);
  };

  const handleEmailInvoice = () => {
    // Logic to send invoice via email
    console.log(`Sending email for invoice ${invoiceId}`);
  };

  const handleDeleteInvoice = async () => {
    setIsDeleting(true);
    setLoading(true);

    try {
      const res = await fetch(`/api/invoice/delete-invoice/${invoiceId}`, {
        method: "DELETE",
      });

      const result = await res.json();

      if (res.ok) {
        toast({
          title: "Success",
          description: result.success,
        });

        router.push("invoices");
        window.location.href = "/invoices";
      } else {
        toast({
          title: "Error",
          description: result.error,
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
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (newStatus: InvoiceStatus) => {
    setIsUpdating(true);

    try {
      const res = await fetch(
        `/api/invoice/update-invoice-status/${invoiceId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const result = await res.json();

      if (res.ok) {
        setStatus(newStatus);
        toast({
          title: "Success",
          description: result.success,
        });
        setTimeout(() => {
          router.push("/invoices");
          window.location.href = "/invoices";
        }, 2000);
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while updating the invoice status.",
        variant: "destructive",
      });
    }

    setIsUpdating(false);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center justify-center p-2 rounded-md hover:bg-gray-100 focus:outline-none"
          disabled={isDeleting || isUpdating}
        >
          {isDeleting || isUpdating ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <MoreHorizontal className="w-5 h-5" />
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" align="end">
        <DropdownMenuItem
          onSelect={handleViewInvoice}
          className="px-4 py-2 text-sm text-gray-700 cursor-pointer"
        >
          View Invoice
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={handleEmailInvoice}
          className="px-4 py-2 text-sm text-gray-700 cursor-pointer"
        >
          Email Invoice
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => handleUpdateStatus("PAID")}
          className="flex items-center gap-2 px-4 py-2 text-sm cursor-pointer"
        >
          {status === "PAID" ? (
            <CheckCircle className="w-4 h-4 text-green-500" />
          ) : (
            <Circle className="w-4 h-4 text-gray-400" />
          )}
          Mark as Paid
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <ConfirmDeleteDialog
            onConfirm={handleDeleteInvoice}
            title="Delete Invoice"
            description="Are you sure you want to delete this invoice? This action cannot be undone."
            triggerElement={
              <button
                className="px-4 py-2 text-sm text-red-500 duration-100 cursor-pointer hover:text-red-300 focus:text-red-300"
                disabled={isDeleting}
              >
                Delete Invoice
              </button>
            }
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default InvoiceActionsDropdown;
