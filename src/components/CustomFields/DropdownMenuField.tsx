"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";
import type { ReactNode } from "react";
import { Controller, Path, UseFormReturn } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "../ui/field";
import Required from "@/components/Required";

export interface OptionProp {
  label: string;
  value: string | number;
  description?: string;
  icon?: ReactNode;
  badge?: ReactNode;
}
interface DropdownMenuFieldProp<T extends Record<string, any>> {
  name: Path<T>;
  form: UseFormReturn<T>;
  fieldName?: string;
  placeholder?: string;
  options: OptionProp[];
  isLabelDisabled?: boolean;
  isDisabled?: boolean;
  isRequired?: boolean;
  onValueChange?: (value: string) => void;
  emptyMessage?: string;
}

export default function DropdownMenuField<T extends Record<string, any>>({
  name,
  form,
  fieldName,
  placeholder = "Select an option...",
  options = [],
  isLabelDisabled,
  isDisabled = false,
  isRequired,
  onValueChange,
  emptyMessage = "No options available.",
}: DropdownMenuFieldProp<T>) {
  "use no memo";

  const normalizedOptions: OptionProp[] = options.map((opt) => ({
    label: opt.label,
    value: String(opt.value),
    description: opt.description,
    badge: opt.badge,
  }));

  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        // Now safely reading from normalized runtime objects matrix
        const activeOption = normalizedOptions.find(
          (option) => String(option.value) === String(value),
        );

        return (
          <Field>
            {!isLabelDisabled && (
              <FieldLabel htmlFor={fieldName}>
                {fieldName}
                {isRequired && <Required />}
              </FieldLabel>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger
                disabled={isDisabled}
                render={
                  <Button
                    id={name}
                    type="button"
                    variant="outline"
                    disabled={isDisabled}
                    className={cn(
                      "w-full h-[46px] px-4 rounded-xl bg-white/[0.06] hover:bg-white/[0.08] focus:bg-white/[0.1] border border-white/[0.08] focus:border-white/20 text-white placeholder:text-zinc-500 text-[13.5px] outline-none transition-all group justify-between font-normal",
                      !value && "text-zinc-500",
                      error
                        ? "border-destructive focus-visible:ring-destructive border-2"
                        : "",
                    )}
                  />
                }
              >
                <span className="truncate text-left block flex-1 mr-2">{activeOption ? activeOption.label : placeholder}</span>
                <ChevronDown className="h-4 w-4 shrink-0 text-zinc-400 opacity-60 transition-transform duration-200 group-data-[popup-open]:rotate-180 data-[popup-open]:rotate-180" />
              </DropdownMenuTrigger>

              <DropdownMenuContent
                className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-[140px] p-1.5 z-50 rounded-xl bg-zinc-900/95 backdrop-blur-md border border-white/[0.1] text-zinc-200 shadow-2xl"
                align="start"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key="dropdown-menu-list"
                    initial={{ opacity: 0, scale: 0.95, y: -4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98, y: -4 }}
                    transition={{ duration: 0.15, ease: "easeInOut" }}
                  >
                    {normalizedOptions.length === 0 ? (
                      <div className="px-2 py-3 text-sm text-muted-foreground text-center">
                        {emptyMessage}
                      </div>
                    ) : (
                      normalizedOptions.map((option) => {
                        const isSelected =
                          String(value) === String(option.value);
                        return (
                          <DropdownMenuItem
                            key={option.value}
                            onClick={() => {
                              const newVal = String(option.value);
                              onChange(newVal);
                              if (onValueChange) {
                                onValueChange(newVal);
                              }
                            }}
                            className={cn(
                              "text-[13px] px-3 py-2 rounded-lg cursor-pointer transition-colors flex items-center justify-between gap-2 text-zinc-200 hover:bg-white/[0.08] hover:text-white outline-none",
                              isSelected
                                ? "bg-white/[0.1] text-white font-medium"
                                : "",
                            )}
                          >
                            <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                              <span className="break-words whitespace-normal text-left">{option.label}</span>
                              {option.description && (
                                <span className="text-xs font-normal text-muted-foreground leading-snug break-words whitespace-normal text-left">
                                  {option.description}
                                </span>
                              )}
                            </div>
                            {option.badge && (
                              <div className="shrink-0">{option.badge}</div>
                            )}
                            {isSelected && (
                              <Check
                                size={14}
                                className="text-primary shrink-0 opacity-80"
                              />
                            )}
                          </DropdownMenuItem>
                        );
                      })
                    )}
                  </motion.div>
                </AnimatePresence>
              </DropdownMenuContent>
            </DropdownMenu>

            {error && (
              <FieldError className="text-destructive">
                {error.message}
              </FieldError>
            )}
          </Field>
        );
      }}
    />
  );
}
