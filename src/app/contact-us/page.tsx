import { Metadata } from "next";

import ContactUsPage from "./ContactUsPage";

export const metadata: Metadata = {
  title: "Contact Us",
};

export default async function Page() {
  return <ContactUsPage />;
}
