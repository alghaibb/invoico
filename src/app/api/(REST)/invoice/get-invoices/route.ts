export const dynamic = "force-dynamic";

import { NextResponse, NextRequest } from "next/server";

import { getIp } from "@/lib/get-ip";
import prisma from "@/lib/prisma";
import { limitGuestInvoices, limitUserInvoices } from "@/utils/invoice";
import { getSession } from "@/utils/session";

export async function GET(request: NextRequest) {
  try {
    // Get query parameters for pagination
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const pageSize = parseInt(url.searchParams.get("pageSize") || "10", 10);

    // Calcuate the offset for prisma
    const skip = (page - 1) * pageSize;

    // Get session and user ID
    const session = await getSession();
    const userId = session?.user?.id;

    if (userId) {
      // Fetch the user with their plan details
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          Plan: true,
          Invoice: {
            skip,
            take: pageSize,
            include: { InvoiceItem: true },
          },
        },
        cacheStrategy: {
          ttl: 120, // Cache invoices for 2 minutes
          swr: 300, // Serve stale data for up to 5 minutes while refreshing
        },
      });

      if (!user) {
        return NextResponse.json({ error: "User not found." }, { status: 404 });
      }

      // Count total invoices for pagination calculation
      const totalInvoices = await prisma.invoice.count({
        where: { userId: user.id },
      });

      // Check remaining invoices for the user
      const { success, remainingInvoices, error } =
        await limitUserInvoices(userId);

      // If the user has reached their invoice limit
      if (!success) {
        return NextResponse.json(
          {
            invoices: user.Invoice,
            remainingInvoices,
            totalInvoices,
            message: error,
          },
          { status: 200 },
        );
      }

      return NextResponse.json(
        {
          invoices: user.Invoice,
          remainingInvoices,
          totalInvoices,
          plan: user.Plan,
        },
        { status: 200 },
      );
    } else {
      // Handle guest logic
      const guestIp = getIp();
      if (!guestIp) {
        return NextResponse.json(
          { error: "Unable to retrieve guest IP" },
          { status: 400 },
        );
      }

      // Fetch guest invoices by IP address
      const guestUsage = await prisma.guestUsage.findUnique({
        where: { ipAddress: guestIp },
        include: {
          Invoice: {
            skip,
            take: pageSize,
            include: { InvoiceItem: true },
          },
        },
      });

      // Count total guest invoices for pagination
      const totalGuestInvoices = await prisma.invoice.count({
        where: { guestId: guestUsage?.id },
      });

      // Check remaining invoices for the guest
      const { success, remainingInvoices, error } = await limitGuestInvoices();

      // If the guest has no remaining invoices
      if (!success) {
        return NextResponse.json(
          {
            invoices: guestUsage?.Invoice || [],
            remainingInvoices,
            totalInvoices: totalGuestInvoices,
            message: error,
          },
          { status: 200 },
        );
      }

      return NextResponse.json(
        {
          invoices: guestUsage?.Invoice || [],
          remainingInvoices,
          totalInvoices: totalGuestInvoices,
        },
        { status: 200 },
      );
    }
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching invoices." },
      { status: 500 },
    );
  }
}
