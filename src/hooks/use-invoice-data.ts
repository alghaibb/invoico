import { useState, useEffect } from "react";

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
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    invoices: [],
    remainingInvoices: null,
    totalInvoices: 0,
    planType: null,
    isGuest: false,
    errorMessage: null,
    loading: true,
  });

  const [page, setPage] = useState(1);
  const pageSize = 10; // Set to 1 to test with 1 invoice per page

  const fetchInvoices = async (page: number = 1, pageSize: number = 10) => { // Set default pageSize to 1
    try {
      setInvoiceData((prevState) => ({ ...prevState, loading: true }));

      const res = await fetch(`/api/invoice/get-invoices?page=${page}&pageSize=${pageSize}`);
      const { invoices, remainingInvoices, totalInvoices, plan } = await res.json();

      setInvoiceData({
        invoices,
        remainingInvoices,
        totalInvoices,
        planType: plan?.type || null,
        isGuest: !plan,
        errorMessage: null,
        loading: false,
      });
    } catch (error) {
      setInvoiceData((prevState) => ({
        ...prevState,
        loading: false,
        errorMessage: "Failed to fetch invoices",
      }));
    }
  };

  useEffect(() => {
    fetchInvoices(page, pageSize);
  }, [page]);

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
