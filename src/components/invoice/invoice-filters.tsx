"use client";

import { useEffect } from "react";
import { PiSortAscendingBold, PiSortDescendingBold } from "react-icons/pi";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useFilter } from "@/providers/FilterProvider";

// Sort arrow indicator
const SortIndicator = ({ sortOrder }: { sortOrder: string }) => {
  return (
    <span>
      {sortOrder === "asc" ? (
        <PiSortAscendingBold size={18} className="ml-2" />
      ) : (
        <PiSortDescendingBold size={18} className="ml-2" />
      )}
    </span>
  );
};

// Filter component
export const InvoiceFilters = () => {
  const { status, sortBy, sortOrder, setStatus, setSortBy, setSortOrder } =
    useFilter();

  // Save the current filter and sort settings to localStorage
  const saveStateToLocalStorage = (
    status: string,
    sortBy: string,
    sortOrder: string,
  ) => {
    localStorage.setItem(
      "invoiceFilters",
      JSON.stringify({ status, sortBy, sortOrder }),
    );
  };

  // Load the saved state from localStorage when the component mounts
  useEffect(() => {
    const savedFilters = localStorage.getItem("invoiceFilters");
    if (savedFilters) {
      const { status, sortBy, sortOrder } = JSON.parse(savedFilters);
      setStatus(status);
      setSortBy(sortBy);
      setSortOrder(sortOrder);
    }
  }, [setStatus, setSortBy, setSortOrder]);

  const handleSortByAmount = () => {
    const newSortOrder =
      sortBy === "amount" && sortOrder === "asc" ? "desc" : "asc";
    setSortBy("amount");
    setSortOrder(newSortOrder);
    saveStateToLocalStorage(status, "amount", newSortOrder);
  };

  const handleSortByDate = () => {
    const newSortOrder =
      sortBy === "date" && sortOrder === "asc" ? "desc" : "asc";
    setSortBy("date");
    setSortOrder(newSortOrder);
    saveStateToLocalStorage(status, "date", newSortOrder);
  };

  const handleStatusChange = (newStatus: string) => {
    //@ts-ignore
    setStatus(newStatus);
    saveStateToLocalStorage(newStatus, sortBy, sortOrder);
  };

  return (
    <div className="flex flex-col gap-2 space-y-4 md:flex-row md:justify-between md:space-y-0 md:space-x-4">
      {/* Status Filter */}
      <div className="flex flex-wrap items-center justify-center space-x-2">
        <Button
          variant={status === "ALL" ? "default" : "outline"}
          onClick={() => handleStatusChange("ALL")}
          className="md:min-w-[80px] min-w-0"
        >
          All
        </Button>
        <Button
          variant={status === "PENDING" ? "default" : "outline"}
          onClick={() => handleStatusChange("PENDING")}
          className="md:min-w-[80px] min-w-0"
        >
          Pending
        </Button>
        <Button
          variant={status === "PAID" ? "default" : "outline"}
          onClick={() => handleStatusChange("PAID")}
          className="md:min-w-[80px] min-w-0"
        >
          Paid
        </Button>
        <Button
          variant={status === "OVERDUE" ? "default" : "outline"}
          onClick={() => handleStatusChange("OVERDUE")}
          className="w-full mt-2 md:w-auto md:mt-0 md:min-w-[80px] min-w-0"
        >
          Overdue
        </Button>
      </div>

      <Separator className="md:hidden" />

      {/* Sort Controls */}
      <div className="flex items-center justify-center space-x-2">
        {/* Sort by Date */}
        <Button
          variant={sortBy === "date" ? "default" : "outline"}
          onClick={handleSortByDate}
          className="md:min-w-[80px]"
        >
          Date {sortBy === "date" && <SortIndicator sortOrder={sortOrder} />}
        </Button>

        {/* Sort by Amount */}
        <Button
          variant={sortBy === "amount" ? "default" : "outline"}
          onClick={handleSortByAmount}
          className="md:min-w-[80px]"
        >
          Amount Due
          {sortBy === "amount" && <SortIndicator sortOrder={sortOrder} />}
        </Button>
      </div>
    </div>
  );
};
