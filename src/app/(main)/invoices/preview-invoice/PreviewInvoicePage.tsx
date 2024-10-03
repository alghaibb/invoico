import { Separator } from "@/components/ui/separator";
import PreviewInvoice from "./PreviewInvoice"; // Correct import path
import prisma from "@/lib/prisma";
import { InvoiceCreateSchema } from "@/validations/invoice";

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
    invoiceNo: invoice.invoiceNo,
    invoiceTitle: invoice.invoiceTitle,
    fromName: invoice.fromName,
    fromEmail: invoice.fromEmail,
    fromAddress: invoice.fromAddress,
    fromPhoneNumber: invoice.fromPhoneNumber ?? undefined,
    abn: invoice.abn ?? undefined,
    toName: invoice.toName,
    toEmail: invoice.toEmail,
    toAddress: invoice.toAddress,
    issueDate: invoice.issueDate,
    dueDate: invoice.dueDate,
    status: invoice.status,
    totalAmount: invoice.totalAmount,
    taxRate: invoice.taxRate,
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
      <h1 className="text-3xl md:text-5xl my-6 text-center font-semibold uppercase ">
        Invoice Preview
      </h1>
      <Separator />
      <PreviewInvoice invoice={parsedInvoice} />
    </div>
  );
};

export default PreviewInvoicePage;
