"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useTransition } from "react";
import { useForm, useFieldArray, useWatch, Controller } from "react-hook-form";
import { z } from "zod";

import { createInvoice } from "@/actions/invoice/create-invoice";
import ConfirmDeleteDialog from "@/components/confirm-delete-dialog";
import { Message } from "@/components/custom-message";
import { DatePicker } from "@/components/date-picker";
import { LoadingDots } from "@/components/loading";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { InvoiceCreateSchema } from "@/validations/invoice";

// Infer form types from Zod schema
type InvoiceFormData = z.infer<typeof InvoiceCreateSchema>;

const CreateInvoiceForm: React.FC = () => {
  const [isPending, startTransition] = useTransition();
  const [invoiceNo, setInvoiceNo] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const { toast } = useToast();

  // Initialize the form with `react-hook-form` and Zod schema resolver
  const form = useForm<InvoiceFormData>({
    resolver: zodResolver(InvoiceCreateSchema),
    defaultValues: {
      invoiceTitle: "",
      invoiceNo: "",
      fromName: "",
      fromEmail: "",
      fromAddress: "",
      fromPhoneNumber: "",
      abn: "",
      toName: "",
      toEmail: "",
      toAddress: "",
      toPhoneNumber: "",
      toMobile: "",
      toFax: "",
      issueDate: new Date(),
      dueDate: new Date(),
      totalAmount: 0,
      taxAmount: 0,
      taxRate: 10,
      items: [{ description: "", quantity: 1, price: 0, total: 0 }],
    },
  });

  const { control, setValue } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  // Watch items and taxRate to trigger recalculation
  const items = useWatch({ control, name: "items" });
  const taxRate = useWatch({ control, name: "taxRate" });

  useEffect(() => {
    // Calculate total for each item and overall total with tax
    items.forEach((item, index) => {
      const total = (item.price || 0) * (item.quantity || 0);
      if (form.getValues(`items.${index}.total`) !== total) {
        setValue(`items.${index}.total`, total);
      }
    });

    const totalWithoutTax = items.reduce(
      (acc, item) => acc + (item.price || 0) * (item.quantity || 0),
      0
    );
    const taxAmount = (totalWithoutTax * (taxRate ?? 0)) / 100;
    const totalAmount = totalWithoutTax + taxAmount;

    setValue("taxAmount", taxAmount);
    setValue("totalAmount", totalAmount);
  }, [items, taxRate, setValue, form]);

  // Get invoice number
  useEffect(() => {
    const fetchInvoiceNo = async () => {
      try {
        const response = await fetch("/api/invoice/get-invoice-no");
        if (!response.ok) {
          throw new Error("Failed to fetch invoice number");
        }
        const data = await response.json();
        setInvoiceNo(data.invoiceNo);
        form.setValue("invoiceNo", data.invoiceNo);
      } catch (error) {
        setError("Failed to fetch invoice number. Please try again.");
      }
    };

    fetchInvoiceNo();
  }, [form]);

  // Handle form submission
  const onSubmit = (data: InvoiceFormData) => {
    startTransition(async () => {
      setError(null);

      try {
        const response = await createInvoice(data);

        if (response?.data?.error) {
          setError(response?.data?.error);
          // Scroll to top of the page
          window.scrollTo({ top: 0, behavior: "instant" });
        } else {
          const invoiceId = response?.data?.invoice?.id ?? "";

          toast({
            title: "Success!",
            description: `${response?.data?.success}, redirecting to invoice preview page...`,
          });
          // Delay for 2 seconds before redirecting
          setTimeout(() => {
            router.push(`/invoices/preview-invoice/${invoiceId}`);
          }, 2000); // 2-second delay
        }
      } catch (err) {
        console.error("Error creating invoice:", err);
        setError(
          "An error occurred while creating your invoice. Please try again."
        );
      }
    });
  };

  const resetFormFields = () => {
    form.reset({
      invoiceTitle: "",
      invoiceNo: "",
      fromName: "",
      fromEmail: "",
      fromAddress: "",
      fromPhoneNumber: "",
      abn: "",
      toName: "",
      toEmail: "",
      toAddress: "",
      toPhoneNumber: "",
      toMobile: "",
      toFax: "",
      issueDate: new Date(),
      dueDate: new Date(),
      totalAmount: 0,
      taxAmount: 0,
      taxRate: 10,
      items: [{ description: "", quantity: 1, price: 0, total: 0 }],
    });
  };

  return (
    <Form {...form}>
      {error && <Message type="error" message={error} />}
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-10 space-y-8">
        {/* Invoice Header */}
        <div className="flex flex-col items-center justify-between mb-6 md:flex-row">
          <FormField
            control={form.control}
            name="invoiceTitle"
            render={({ field }) => (
              <FormItem className="w-full md:w-auto">
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Invoice Title"
                    className="w-full text-2xl font-semibold md:text-3xl md:py-6"
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Separator className="my-6" />

        {/* Invoice Number, Issue Date, Due Date */}
        <div className="flex flex-col gap-6 w-full max-w-[500px]">
          <FormField
            control={form.control}
            name="invoiceNo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Invoice Number</FormLabel>
                <FormControl>
                  {invoiceNo ? (
                    <Input
                      id="invoiceNo"
                      {...field}
                      placeholder="e.g. INV0001"
                      disabled={isPending}
                    />
                  ) : (
                    <LoadingDots />
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Issue Date */}
          <FormField
            control={form.control}
            name="issueDate"
            render={() => (
              <FormItem>
                <FormLabel>Issue Date</FormLabel>
                <FormControl>
                  <Controller
                    control={control}
                    name="issueDate"
                    render={({ field: { value, onChange } }) => (
                      <DatePicker
                        date={value}
                        onSelect={(selectedDate) => {
                          if (selectedDate !== value) {
                            onChange(selectedDate);
                          }
                        }}
                      />
                    )}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Due Date */}
          <FormField
            control={form.control}
            name="dueDate"
            render={() => (
              <FormItem>
                <FormLabel>Due Date</FormLabel>
                <FormControl>
                  <Controller
                    control={control}
                    name="dueDate"
                    render={({ field: { value, onChange } }) => (
                      <DatePicker
                        date={value}
                        onSelect={(selectedDate) => {
                          if (selectedDate !== value) {
                            onChange(selectedDate);
                          }
                        }}
                      />
                    )}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Separator className="my-6" />

        {/* From and Bill To Sections */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* From Section */}
          <div className="space-y-4">
            <h2 className="mb-2 text-lg font-semibold">From</h2>
            <FormField
              control={form.control}
              name="fromName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Business Name" />
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
                    <Input {...field} placeholder="name@business.com" />
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
                    <Input {...field} placeholder="Street" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fromPhoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="(123) 456 789" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="abn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ABN</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="53 004 085 616" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Bill To Section */}
          <div className="space-y-4">
            <h2 className="mb-2 text-lg font-semibold">Bill To</h2>
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
                    <Input {...field} placeholder="name@client.com" />
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
                  <FormLabel>Client Address</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Client Address" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="toPhoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="(123) 456 789" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="toMobile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mobile</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="(123) 456 789" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="toFax"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fax</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="(123) 456 789" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Separator className="my-6" />

        {/* Invoice Items */}
        <div className="py-4">
          <h2 className="mb-4 text-lg font-semibold">Invoice Items</h2>
          <div className="overflow-x-auto">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fields.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell className="min-w-[150px]">
                      <Input
                        value={form.watch(`items.${index}.description`)}
                        onChange={(e) =>
                          setValue(`items.${index}.description`, e.target.value)
                        }
                        placeholder="Item Description"
                      />
                    </TableCell>
                    <TableCell className="min-w-[100px]">
                      <div className="relative">
                        <span className="absolute transform -translate-y-1/2 left-2 top-1/2 text-muted-foreground">
                          $
                        </span>
                        <Input
                          type="number"
                          className="pl-6"
                          step="0.01"
                          value={
                            form.watch(`items.${index}.price`).toFixed(2) || 0
                          }
                          onChange={(e) =>
                            setValue(
                              `items.${index}.price`,
                              parseFloat(e.target.value)
                            )
                          }
                          placeholder="Price"
                        />
                      </div>
                    </TableCell>

                    <TableCell className="min-w-[100px]">
                      <Input
                        type="number"
                        value={form.watch(`items.${index}.quantity`)}
                        onChange={(e) =>
                          setValue(
                            `items.${index}.quantity`,
                            parseFloat(e.target.value)
                          )
                        }
                        placeholder="Quantity"
                      />
                    </TableCell>
                    <TableCell className="min-w-[100px]">
                      <div className="relative">
                        <span className="absolute transform -translate-y-1/2 left-2 top-1/2 text-muted-foreground">
                          $
                        </span>
                        <Input
                          type="number"
                          className="pl-6 border-none pointer-events-none focus:ring-0 focus:outline-none"
                          readOnly
                          step="0.01"
                          value={form.watch(`items.${index}.total`).toFixed(2)}
                          placeholder="Amount"
                        />
                      </div>
                    </TableCell>

                    <TableCell className="min-w-[100px]">
                      <ConfirmDeleteDialog onConfirm={() => remove(index)} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

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

        <Separator className="my-6" />

        {/* Tax and Total Sections */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormItem>
            <FormLabel>Tax Rate</FormLabel>
            <FormControl>
              <div className="relative">
                <Input
                  type="number"
                  value={taxRate}
                  onChange={(e) =>
                    setValue("taxRate", parseFloat(e.target.value))
                  }
                  className="pr-8"
                />
                <span className="absolute right-[33rem] top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm">
                  %
                </span>
              </div>
            </FormControl>
          </FormItem>

          <FormField
            control={form.control}
            name="taxAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tax Amount</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute transform -translate-y-1/2 left-2 top-1/2 text-muted-foreground">
                      $
                    </span>
                    <Input
                      {...field}
                      readOnly
                      step="0.01"
                      value={form.watch("taxAmount")?.toFixed(2)}
                      className="pl-6 border-none pointer-events-none focus:ring-0 focus:outline-none"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="totalAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Total Amount</FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute transform -translate-y-1/2 left-2 top-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    {...field}
                    readOnly
                    step="0.01"
                    value={form.watch("totalAmount")?.toFixed(2)}
                    className="pl-6 border-none pointer-events-none focus:ring-0 focus:outline-none"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <div className="flex flex-col justify-between w-full md:flex-row">
          <Button
            type="submit"
            className="w-full mt-6 md:w-auto"
            disabled={isPending || !invoiceNo}
          >
            {isPending ? <LoadingDots /> : "Create Invoice"}
          </Button>

          {/* Reset Form Fields Button */}
          <Button
            type="button"
            variant="outline"
            onClick={resetFormFields}
            className="w-full mt-4 md:w-auto"
          >
            Reset Form
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CreateInvoiceForm;
