"use client";

import * as React from "react";
import { DropdownProps } from "react-day-picker";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function CalendarDropdown(props: DropdownProps) {
  const { options, value, onChange, className } = props;

  const activeOption = options?.find(
    (opt) => String(opt.value) === String(value),
  );

  const handleChange = (newValue: string | number) => {
    if (onChange) {
      const syntheticEvent = {
        target: { value: String(newValue) },
      } as React.ChangeEvent<HTMLSelectElement>;
      onChange(syntheticEvent);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn(
            "group h-8 z-10 w-fit gap-1 text-sm font-medium justify-between",
            className,
          )}
        >
          {activeOption?.label}
          <ChevronDown className="h-3.5 w-3.5 opacity-60 transition-transform duration-200 group-data-[state=open]:rotate-180 data-[state=open]:rotate-180" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-h-64 overflow-y-auto min-w-[8rem] bg-background">
        {options?.map((option) => (
          <DropdownMenuItem
            key={option.value}
            disabled={option.disabled}
            onSelect={() => handleChange(option.value)}
            className={cn(
              String(option.value) === String(value) && "bg-accent font-medium",
            )}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
