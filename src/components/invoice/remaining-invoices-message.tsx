"use client";

import Link from "next/link";

import { Message } from "@/components/custom-message";

type RemainingInvoicesMessageProps = {
  remainingInvoices: number;
  isGuest: boolean;
};

export const RemainingInvoicesMessage = ({
  remainingInvoices,
  isGuest,
}: RemainingInvoicesMessageProps) => {
  const warningThreshold = 5;

  if (isGuest) {
    // If the guest has 0 remaining invoices, display a warning message.
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

    // If the guest has 1 remaining invoice, display a warning with the link.
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

  // For non-guests, use the normal warning/info message based on their plan.
  return (
    <Message
      type={remainingInvoices <= warningThreshold ? "warning" : "info"}
      message={`You have ${remainingInvoices} invoices left to create according to your plan.`}
    />
  );
};
