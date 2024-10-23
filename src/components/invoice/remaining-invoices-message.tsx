"use client";

import Link from "next/link";

import { Message } from "@/components/custom-message";

type RemainingInvoicesMessageProps = {
  remainingInvoices: number | null;
  isGuest: boolean;
};

export const RemainingInvoicesMessage = ({
  remainingInvoices = 0,
  isGuest,
}: RemainingInvoicesMessageProps) => {
  const warningThreshold = 5;

  // Guest Logic
  if (isGuest) {
    if (remainingInvoices === 0) {
      return (
        <Message
          type="warning"
          message={
            <>
              You have no remaining invoices as a guest.{" "}
              <Link
                href="/create-account"
                className="text-blue-500 underline underline-offset-4"
              >
                Create an account
              </Link>{" "}
              to create more invoices.
            </>
          }
        />
      );
    }

    return (
      <Message
        type={remainingInvoices === 1 ? "warning" : "info"}
        message={
          <>
            You have {remainingInvoices} invoice
            {remainingInvoices === 1 ? "" : "s"} left to create as a guest.{" "}
            {remainingInvoices === 1 && (
              <>
                This is your last free invoice!{" "}
                <Link
                  href="/create-account"
                  className="text-blue-500 underline underline-offset-4"
                >
                  Create an account
                </Link>{" "}
                to make more.
              </>
            )}
          </>
        }
      />
    );
  }

  // User Logic (not a guest)
  if (remainingInvoices === 0) {
    return (
      <Message
        type="warning"
        message="You have reached your invoice limit for this month. Please upgrade your plan or wait until next month to create more invoices."
      />
    );
  }

  return (
    <Message
      type={
        remainingInvoices !== null && remainingInvoices <= warningThreshold
          ? "warning"
          : "info"
      }
      message={`You have ${remainingInvoices} invoice${
        remainingInvoices === 1 ? "" : "s"
      } left to create according to your plan.`}
    />
  );
};
