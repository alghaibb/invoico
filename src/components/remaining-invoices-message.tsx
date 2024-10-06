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
  // Define a threshold for warning (e.g., 5 invoices left)
  const warningThreshold = 5;
  const guestWarningThreshold = 1;

  return (
    <div>
      {isGuest ? (
        <Message
          type={remainingInvoices <= guestWarningThreshold ? "warning" : "info"}
          message={
            <>
              You have {remainingInvoices} invoices left to create as a guest.{" "}
              <Link
                href="/create-account"
                className="text-blue-500 underline underline-offset-4"
              >
                Create an account
              </Link>{" "}
              to make more.
            </>
          }
        />
      ) : (
        <Message
          type={remainingInvoices <= warningThreshold ? "warning" : "info"}
          message={`You have ${remainingInvoices} invoices left to create according to your plan.`}
        />
      )}
    </div>
  );
};
