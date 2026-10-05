"use client";

import Required from "@/components/Required";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { format, parse } from "date-fns";
import { ChevronDown } from "lucide-react";
import { Controller, Path, UseFormReturn } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "../ui/field";

interface TimePickerFieldProps<T extends Record<string, any>> {
  name: Path<T>;
  form: UseFormReturn<T>;
  fieldName?: string;
  isRequired?: boolean;
  isLabelDisabled?: boolean;
}

export default function TimePickerField<T extends Record<string, any>>({
  name,
  form,
  fieldName,
  isRequired = false,
  isLabelDisabled = false,
}: TimePickerFieldProps<T>) {
  "use no memo";

  // Generate lists for hour and minute
  const hours = Array.from({ length: 12 }, (_, i) =>
    String(i + 1).padStart(2, "0")
  );
  const minutes = Array.from({ length: 60 }, (_, i) =>
    String(i).padStart(2, "0")
  );
  const periods = ["AM", "PM"];

  const parseTimeStr = (timeStr: string) => {
    if (!timeStr) return { hour: "12", minute: "00", period: "AM" };
    try {
      const parts = timeStr.split(":");
      let date: Date;
      if (parts.length === 3) {
        date = parse(timeStr, "HH:mm:ss", new Date());
      } else {
        date = parse(timeStr, "HH:mm", new Date());
      }
      return {
        hour: format(date, "hh"),
        minute: format(date, "mm"),
        period: format(date, "a").toUpperCase(),
      };
    } catch (e) {
      console.error("Failed to parse time string:", timeStr, e);
      return { hour: "12", minute: "00", period: "AM" };
    }
  };

  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const { hour, minute, period } = parseTimeStr(String(value || ""));

        const handleValChange = (
          type: "hour" | "minute" | "period",
          newVal: string
        ) => {
          const currentHour = type === "hour" ? newVal : hour;
          const currentMinute = type === "minute" ? newVal : minute;
          const currentPeriod = type === "period" ? newVal : period;

          try {
            const combined = `${currentHour}:${currentMinute} ${currentPeriod}`;
            const date = parse(combined, "hh:mm a", new Date());
            const formatted = format(date, "HH:mm");
            onChange(formatted);
          } catch (e) {
            console.error("Failed to format time values:", e);
          }
        };

        return (
          <Field className="w-full">
            {!isLabelDisabled && (
              <FieldLabel htmlFor={fieldName}>
                {fieldName}
                {isRequired && <Required />}
              </FieldLabel>
            )}

            <div
              className={cn(
                "flex items-center gap-1.5 px-3 border border-input bg-background rounded-md h-11 w-full shadow-inner focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 transition-shadow duration-150",
                error && "border-destructive focus-within:ring-destructive focus-within:border-destructive"
              )}
            >
              {/* Hour Dropdown */}
              <div className="flex-1 h-full min-w-[50px] flex items-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      className="group h-9 my-1 w-full outline-none focus:outline-none flex items-center justify-between gap-0.5 px-2 hover:bg-muted/40 transition-colors cursor-pointer text-sm font-medium rounded-sm shadow-none"
                    >
                      <span className="flex items-baseline gap-0.5">
                        <span>{hour}</span>
                        <span className="text-[10px] text-muted-foreground/80 font-normal">h</span>
                      </span>
                      <ChevronDown className="h-3.5 w-3.5 opacity-60 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="p-1 bg-background z-50 min-w-[4rem]">
                    <ScrollArea className="h-56 pr-1">
                      {hours.map((h) => (
                        <DropdownMenuItem
                          key={h}
                          onSelect={() => handleValChange("hour", h)}
                          className="cursor-pointer text-center justify-center font-medium"
                        >
                          {h}
                        </DropdownMenuItem>
                      ))}
                    </ScrollArea>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <span className="text-muted-foreground/30 font-semibold select-none">:</span>

              {/* Minute Dropdown */}
              <div className="flex-1 h-full min-w-[50px] flex items-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      className="group h-9 my-1 w-full outline-none focus:outline-none flex items-center justify-between gap-0.5 px-2 hover:bg-muted/40 transition-colors cursor-pointer text-sm font-medium rounded-sm shadow-none"
                    >
                      <span className="flex items-baseline gap-0.5">
                        <span>{minute}</span>
                        <span className="text-[10px] text-muted-foreground/80 font-normal">m</span>
                      </span>
                      <ChevronDown className="h-3.5 w-3.5 opacity-60 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="p-1 bg-background z-50 min-w-[4rem]">
                    <ScrollArea className="h-56 pr-1">
                      {minutes.map((m) => (
                        <DropdownMenuItem
                          key={m}
                          onSelect={() => handleValChange("minute", m)}
                          className="cursor-pointer text-center justify-center font-medium"
                        >
                          {m}
                        </DropdownMenuItem>
                      ))}
                    </ScrollArea>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <span className="text-muted-foreground/30 font-semibold select-none">|</span>

              {/* AM/PM Dropdown */}
              <div className="flex-1 h-full min-w-[50px] flex items-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      className="group h-9 my-1 w-full outline-none focus:outline-none flex items-center justify-between gap-0.5 px-2 hover:bg-muted/40 transition-colors cursor-pointer text-sm font-medium rounded-sm bg-muted/20 shadow-none"
                    >
                      <span>{period}</span>
                      <ChevronDown className="h-3.5 w-3.5 opacity-60 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-background z-50 min-w-[4.5rem]">
                    {periods.map((p) => (
                      <DropdownMenuItem
                        key={p}
                        onSelect={() => handleValChange("period", p)}
                        className="cursor-pointer text-center justify-center font-medium"
                      >
                        {p}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {error && (
              <FieldError className="text-destructive mt-1">
                {error.message}
              </FieldError>
            )}
          </Field>
        );
      }}
    />
  );
}
