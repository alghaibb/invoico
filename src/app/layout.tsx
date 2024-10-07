/* eslint-disable import/order */
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";

import { auth } from "@/auth";
import Navbar from "@/components/navbar/Navbar";
import { Toaster } from "@/components/ui/toaster";

import "@/styles/globals.css";
import { FilterProvider } from "@/providers/FilterProvider";
import Footer from "@/components/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | Invoico",
    absolute: "Invoico",
  },
  description: "Invoico is a simple invoicing app.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <SessionProvider session={session}>
      <FilterProvider>
        <html lang="en" suppressHydrationWarning>
          <body
            className={`${inter.className} min-h-screen flex flex-col relative`}
          >
            <main className="flex-grow">
              <Navbar />
              {children}
              <Footer />
            </main>
            <Toaster />
          </body>
        </html>
      </FilterProvider>
    </SessionProvider>
  );
}
