export const formatCurrency = (
  amount: number,
  currency: string = "AUD",
): string => {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency,
  }).format(amount);
};

export const formatDate = (date: Date | string): string => {
  const parsedDate = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-AU", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(parsedDate);
};
