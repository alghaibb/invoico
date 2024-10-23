import { z } from "zod";

// Invoice Item schema
const InvoiceItemSchema = z.object({
  description: z.string().min(1, "Item description is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  price: z.preprocess(
    (val) => parseFloat(val as string),
    z.number().min(0, "Price must be a positive number"),
  ),
  total: z.number().min(0, "Total must be a positive number"),
});

// Invoice schema
export const InvoiceCreateSchema = z.object({
  id: z.string().optional(),
  invoiceTitle: z.string().min(1, "Invoice title is required"),
  invoiceNo: z.string().optional(),

  // Preprocess the optional fields to convert empty strings to undefined
  fromName: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.string().min(1, "Sender name is required").optional(),
  ),
  fromEmail: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.string().email("Invalid sender email address").optional(),
  ),
  fromAddress: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.string().min(1, "Sender address is required").optional(),
  ),
  fromPhoneNumber: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.string().optional(),
  ),
  abn: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.string().optional(),
  ),

  toName: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.string().min(1, "Recipient name is required").optional(),
  ),
  toEmail: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.string().email("Invalid recipient email address").optional(),
  ),
  toAddress: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.string().min(1, "Recipient address is required").optional(),
  ),
  toPhoneNumber: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.string().optional(),
  ),
  toMobile: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.string().optional(),
  ),
  toFax: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.string().optional(),
  ),

  issueDate: z.date().or(z.string().transform((val) => new Date(val))),
  dueDate: z.date().or(z.string().transform((val) => new Date(val))),

  status: z.enum(["PENDING", "PAID", "OVERDUE"]).default("PENDING"),
  totalAmount: z.number().min(0, "Total amount must be a positive number"),
  taxRate: z.number().min(0).max(100).optional(),
  taxAmount: z.number().optional(),

  // Array of invoice items
  items: z.array(InvoiceItemSchema).min(1, "At least one item is required"),
});
