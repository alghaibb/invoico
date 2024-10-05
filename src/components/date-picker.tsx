"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import * as React from "react";


import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar"; // Ensure this component exists and works with Date objects
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  date: Date | undefined; // Allow undefined as the initial state
  onSelect: (date: Date) => void;
  disabled?: boolean;
}

export function DatePicker({ date, onSelect, disabled }: DatePickerProps) {
  // Provide a fallback for the initial date if date is undefined
  const selectedDate = date || new Date();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal", // Adjust the width here to w-full or any specific width
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(day) => day && onSelect(day)} // Ensure day is not undefined before calling onSelect
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
