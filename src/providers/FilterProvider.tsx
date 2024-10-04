"use client";

import React, { createContext, useContext, useState } from "react";

// Define statuses
type InvoiceStatus = "ALL" | "PENDING" | "PAID" | "OVERDUE";

// Define sorting options
type SortOption = "date" | "amount";
type SortOrder = "asc" | "desc";

// Define context value types
interface FilterContextType {
  status: InvoiceStatus;
  sortBy: SortOption;
  sortOrder: SortOrder;
  setStatus: (status: InvoiceStatus) => void;
  setSortBy: (sort: SortOption) => void;
  setSortOrder: (order: SortOrder) => void;
}

// Create context
const FilterContext = createContext<FilterContextType | undefined>(undefined);

// Filter provider component
export const FilterProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [status, setStatus] = useState<InvoiceStatus>("ALL");
  const [sortBy, setSortBy] = useState<SortOption>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  return (
    <FilterContext.Provider
      value={{ status, sortBy, sortOrder, setStatus, setSortBy, setSortOrder }}
    >
      {children}
    </FilterContext.Provider>
  );
};

// Custom hook to use the filter context
export const useFilter = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("useFilter must be used within a FilterProvider");
  }
  return context;
};
