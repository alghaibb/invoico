import { z } from "zod";

// Invoice Item schema
const InvoiceItemSchema = z.object({
  description: z.string().min(1, "Item description is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  price: z.preprocess((val) => parseFloat(val as string), z.number().min(0, "Price must be a positive number")),
  total: z.number().min(0, "Total must be a positive number"),
});

// Invoice schema
export const InvoiceCreateSchema = z.object({
  invoiceTitle: z.string().min(1, "Invoice title is required"),
  invoiceNo: z.string().optional(),
  fromName: z.string().min(1, "Sender name is required"),
  fromEmail: z.string().email("Invalid sender email address"),
  fromAddress: z.string().min(1, "Sender address is required"),
  fromPhoneNumber: z.string().optional(),
  abn: z.string().optional(),

  toName: z.string().min(1, "Recipient name is required"),
  toEmail: z.string().email("Invalid recipient email address"),
  toAddress: z.string().min(1, "Recipient address is required"),
  toPhoneNumber: z.string().optional(),
  toMobile: z.string().optional(),
  toFax: z.string().optional(),

  issueDate: z.date().or(z.string().transform((val) => new Date(val))),
  dueDate: z.date().or(z.string().transform((val) => new Date(val))),

  status: z.enum(["PENDING", "PAID", "OVERDUE"]).default("PENDING"),
  totalAmount: z.number().min(0, "Total amount must be a positive number"),
  taxRate: z.number().min(0).max(100).optional(),
  taxAmount: z.number().optional(),

  // Array of invoice items
  items: z.array(InvoiceItemSchema).min(1, "At least one item is required"),
});