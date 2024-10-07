import { useState, useEffect } from "react";

type InvoiceData = {
  invoices: Invoice[];
  remainingInvoices: number | null;
  planType: string | null;
  isGuest: boolean;
  errorMessage: string | null;
  loading: boolean;
};

const useInvoiceData = () => {
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    invoices: [],
    remainingInvoices: null,
    planType: null,
    isGuest: false,
    errorMessage: null,
    loading: true,
  });

  const fetchInvoices = async () => {
    try {
      const res = await fetch("/api/invoice/get-invoices");
      const { invoices, remainingInvoices, plan } = await res.json();
      setInvoiceData({
        invoices,
        remainingInvoices,
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
    fetchInvoices();
  }, []);

  return {
    ...invoiceData,
    setInvoiceData,
    refetchInvoices: fetchInvoices,
  };
};

export default useInvoiceData;
