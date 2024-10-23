import { Separator } from "@/components/ui/separator";
import prisma from "@/lib/prisma";
import { InvoiceCreateSchema } from "@/validations/invoice";

import PreviewInvoice from "./PreviewInvoice"; // Correct import path

interface Params {
  invoiceId: string;
}

const PreviewInvoicePage = async ({ params }: { params: Params }) => {
  const { invoiceId } = params;

  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: {
      InvoiceItem: true,
    },
  });

  if (!invoice) {
    return <div>Invoice not found</div>;
  }

  // Transform invoice data to match Zod schema
  const invoiceData = {
    id: invoice.id,
    invoiceNo: invoice.invoiceNo ?? undefined,
    invoiceTitle: invoice.invoiceTitle ?? undefined,
    fromName: invoice.fromName ?? undefined,
    fromEmail: invoice.fromEmail ?? undefined,
    fromAddress: invoice.fromAddress ?? undefined,
    fromPhoneNumber: invoice.fromPhoneNumber ?? undefined,
    abn: invoice.abn ?? undefined,
    toName: invoice.toName ?? undefined,
    toEmail: invoice.toEmail ?? undefined,
    toAddress: invoice.toAddress ?? undefined,
    toPhoneNumber: invoice.toPhoneNumber ?? undefined,
    toMobile: invoice.toMobile ?? undefined,
    toFax: invoice.toFax ?? undefined,
    issueDate: invoice.issueDate ?? undefined,
    dueDate: invoice.dueDate ?? undefined,
    status: invoice.status ?? undefined,
    totalAmount: invoice.totalAmount ?? undefined,
    taxRate: invoice.taxRate ?? undefined,
    taxAmount: invoice.taxAmount ?? undefined,
    items: invoice.InvoiceItem.map((item) => ({
      description: item.description,
      quantity: item.quantity,
      price: item.price,
      total: item.total,
    })),
  };

  // Validate data with Zod schema
  const parsedInvoice = InvoiceCreateSchema.parse(invoiceData);
  return (
    <div>
      <h1 className="my-6 text-3xl font-semibold text-center uppercase md:text-5xl ">
        Invoice Preview
      </h1>
      <Separator />
      <PreviewInvoice invoice={parsedInvoice} />
    </div>
  );
};

export default PreviewInvoicePage;
