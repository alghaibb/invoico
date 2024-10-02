import { Metadata } from "next";
import CreateInvoicePage from "./CreateInvoicePage";

export const metadata: Metadata = {
  title: "Create Invoice",
};

export default async function Page() {
  return <CreateInvoicePage />;
}
