"use client";

import React, { useEffect, useState, useTransition } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createInvoice } from "@/actions/invoice/create-invoice";
import { InvoiceCreateSchema } from "@/validations/invoice";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/date-picker";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";
import { LoadingDots } from "@/components/ui/loading";
import { useToast } from "@/hooks/use-toast";

// Infer form types from Zod schema
type InvoiceFormData = z.infer<typeof InvoiceCreateSchema>;

const CreateInvoiceForm: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [taxRate, setTaxRate] = useState<number>(10); // Default tax rate
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  // Initialize the form with `react-hook-form` and Zod schema resolver
  const form = useForm<InvoiceFormData>({
    resolver: zodResolver(InvoiceCreateSchema),
    defaultValues: {
      invoiceTitle: "",
      fromName: "",
      fromEmail: "",
      fromAddress: "",
      toName: "",
      toEmail: "",
      toAddress: "",
      issueDate: new Date(),
      dueDate: new Date(),
      totalAmount: 0,
      taxAmount: undefined,
      items: [{ description: "", quantity: 1, price: 0, total: 0 }],
    },
  });

  const { control, watch, setValue, handleSubmit } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const items = watch("items");

  // Automatically calculate total amounts whenever item prices or quantities change
  useEffect(() => {
    const totalAmount = items.reduce((acc, item, index) => {
      const itemTotal = item.price * item.quantity;
      // Avoid unnecessary updates
      if (item.total !== itemTotal) {
        setValue(`items.${index}.total`, itemTotal); // Update only when the total is different
      }
      return acc + itemTotal;
    }, 0);

    setValue("totalAmount", totalAmount);

    const taxAmount = (totalAmount * taxRate) / 100;
    setValue("taxAmount", taxAmount);
  }, [items, setValue, taxRate]);

  // Handle form submission
  const onSubmit = async (data: InvoiceFormData) => {
    setLoading(true);
    setError(null);

    try {
      // Call the server action to create the invoice
      const response = await createInvoice(data);

      if (response?.data?.error) {
        setError(response?.data?.error);
        toast({
          title: "Error",
          description: response?.data?.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Invoice Created",
          description: response?.data?.success,
        });
        // Optionally reset form or redirect
        form.reset();
      }
    } catch (err) {
      console.error("Error creating invoice:", err);
      setError(
        "An error occurred while creating your invoice. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-32">
        {/* Invoice Title and Logo */}
        <div className="flex justify-between items-center mb-6">
          <FormField
            control={form.control}
            name="invoiceTitle"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Invoice Title"
                    className="text-3xl font-semibold"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="w-24 h-24 bg-gray-100 flex justify-center items-center">
            <span className="text-gray-500">+ Logo</span>
          </div>
        </div>

        {/* From and Bill To Section */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold mb-2">From</h2>
            <FormField
              control={form.control}
              name="fromName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Your Business Name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fromEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Your Email" type="email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fromAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Your Address" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Bill To</h2>
            <FormField
              control={form.control}
              name="toName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Client Name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="toEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client Email</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Client Email" type="email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="toAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Client Address" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Date and Invoice Number */}
        <div className="grid grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="issueDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Issue Date</FormLabel>
                <FormControl>
                  <DatePicker date={field.value} onSelect={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Input placeholder="Invoice Number (e.g., INV0001)" />
        </div>

        {/* Table for Invoice Items */}
        <div className="border-t border-b py-4">
          <h2 className="text-lg font-semibold mb-4">Invoice Items</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead>Rate ($)</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Amount ($)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fields.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Input
                      {...form.register(`items.${index}.description`)}
                      placeholder="Item Description"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      {...form.register(`items.${index}.price`)}
                      type="number"
                      placeholder="Rate"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      {...form.register(`items.${index}.quantity`)}
                      type="number"
                      placeholder="Quantity"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      {...form.register(`items.${index}.total`)}
                      type="number"
                      placeholder="Amount"
                      readOnly
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => remove(index)}
                    >
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Add Item Button */}
          <Button
            type="button"
            onClick={() =>
              append({ description: "", quantity: 1, price: 0, total: 0 })
            }
            className="mt-4"
          >
            + Add Item
          </Button>
        </div>

        {/* Tax and Total Amount Section */}
        <div className="grid grid-cols-2 gap-6">
          <FormItem>
            <FormLabel>Tax Rate (%)</FormLabel>
            <FormControl>
              <Input
                type="number"
                value={taxRate}
                onChange={(e) => setTaxRate(parseFloat(e.target.value))}
                placeholder="Tax Rate"
              />
            </FormControl>
          </FormItem>

          <FormField
            control={form.control}
            name="taxAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tax Amount ($)</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Tax Amount" readOnly />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Total Amount Section */}
        <FormField
          control={form.control}
          name="totalAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Total Amount ($)</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Total Amount" readOnly />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button type="submit" className="w-full mt-6" disabled={loading}>
          {loading ? <LoadingDots /> : "Create Invoice"}
        </Button>
      </form>
    </Form>
  );
};

export default CreateInvoiceForm;
