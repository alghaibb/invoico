import { Metadata } from "next";

import PreviewInvoicePage from "../PreviewInvoicePage";

export const metadata: Metadata = {
  title: "Preview Your Invoice",
};

export default async function Page({
  params,
}: {
  params: { invoiceId: string };
}) {
  return <PreviewInvoicePage params={params} />;
}
