import { Metadata } from "next";

import InvoiceTablePage from "./InvoiceTablePage";

export const metadata: Metadata = {
  title: "Your Invoices",
};

export default async function Page() {
  return <InvoiceTablePage />;
}
