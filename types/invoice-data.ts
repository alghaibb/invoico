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
