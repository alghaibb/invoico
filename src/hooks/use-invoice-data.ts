import { Invoice } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useState, useEffect, useCallback } from "react";

type InvoiceData = {
  invoices: Invoice[];
  remainingInvoices: number | null;
  totalInvoices: number | null;
  planType: string | null;
  isGuest: boolean;
  errorMessage: string | null;
  loading: boolean;
};

const useInvoiceData = () => {
  const { data: session, status } = useSession(); // Use session to track authentication state

  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    invoices: [],
    remainingInvoices: null,
    totalInvoices: 0,
    planType: null,
    isGuest: false, // Default to false
    errorMessage: null,
    loading: true,
  });

  const [page, setPage] = useState(1);
  const pageSize = 10; // Number of invoices per page

  const fetchInvoices = useCallback(
    async (page: number = 1, pageSize: number = 10) => {
      try {
        setInvoiceData((prevState) => ({ ...prevState, loading: true }));

        // Fetch invoices from the API only if we don’t have them already
        const res = await fetch(
          `/api/invoice/get-invoices?page=${page}&pageSize=${pageSize}`,
        );
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch invoices");
        }

        setInvoiceData((prevState) => ({
          invoices: data.invoices || [], // Ensure empty array if no invoices
          remainingInvoices: data.remainingInvoices || 0,
          totalInvoices: data.totalInvoices || 0,
          planType: data.plan?.type || null,
          isGuest: !session?.user, // If no session, treat as guest
          errorMessage: null,
          loading: false, // Set loading to false after data is fetched
        }));
      } catch (error) {
        setInvoiceData((prevState) => ({
          ...prevState,
          loading: false,
          errorMessage:
            error instanceof Error ? error.message : "Failed to fetch invoices",
        }));
      }
    },
    [session],
  );

  // Fetch invoices when the page or session changes, and only fetch once unless data is invalidated
  useEffect(() => {
    if (status === "loading") return; // Don't fetch while session is loading

    // Check if invoices are already loaded to avoid refetching
    if (!invoiceData.invoices.length) {
      fetchInvoices(page, pageSize);
    }

    // Set isGuest based on session state
    setInvoiceData((prevState) => ({
      ...prevState,
      isGuest: !session?.user,
    }));
  }, [
    page,
    session,
    status,
    fetchInvoices,
    pageSize,
    invoiceData.invoices.length,
  ]);

  return {
    ...invoiceData,
    setInvoiceData,
    refetchInvoices: () => fetchInvoices(page, pageSize),
    setPage,
    page,
    totalPages: Math.ceil(invoiceData.totalInvoices! / pageSize),
  };
};

export default useInvoiceData;
