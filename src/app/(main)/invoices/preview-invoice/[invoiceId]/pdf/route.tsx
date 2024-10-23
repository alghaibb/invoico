import { renderToStream } from "@react-pdf/renderer"; // Correct import for PDF rendering
import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { nodeStreamToWeb } from "@/utils/nodeStreamToWeb";

import InvoicePDF from "./invoice-pdf";

// Dynamic rendering to ensure it fetches fresh data
export const dynamic = "force-dynamic";

// API Route to handle PDF generation for an invoice
export async function GET(
  request: NextRequest,
  { params }: { params: { invoiceId: string } },
) {
  try {
    const invoiceId = params.invoiceId; // Extract invoiceId from path params

    if (!invoiceId) {
      return NextResponse.json(
        { error: "Invoice ID is required" },
        { status: 400 },
      );
    }

    // Fetch invoice from Prisma database by ID, including the associated items
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: { InvoiceItem: true }, // Assuming your Prisma schema includes an InvoiceItem relation
    });

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    // Transform the Prisma data to match the shape expected by the InvoicePDF component
    const transformedInvoice = {
      ...invoice,
      items: invoice.InvoiceItem.map((item) => ({
        description: item.description,
        quantity: item.quantity,
        price: item.price,
        total: item.total,
      })),
    };

    // Render the PDF to a Node.js readable stream using react-pdf
    const pdfStream = await renderToStream(
      <InvoicePDF invoice={transformedInvoice} />,
    );

    // Convert Node.js ReadableStream to Web ReadableStream
    const webStream = nodeStreamToWeb(pdfStream);

    // Return the PDF as a response
    return new Response(webStream, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=invoice-${invoiceId}.pdf`,
      },
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return NextResponse.json(
      { error: "An error occurred while generating the PDF" },
      { status: 500 },
    );
  }
}
