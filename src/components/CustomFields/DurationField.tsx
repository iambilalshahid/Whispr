"use client";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { cn } from "@/lib/utils";

import { motion } from "framer-motion";
import { useState } from "react";
import { Controller, Path, UseFormReturn } from "react-hook-form";
import Required from "../Required";

interface DurationFieldProp<T extends Record<string, any>> {
  name: Path<T>;
  form: UseFormReturn<T>;
  fieldName: string;
  placeholder?: string;
  unit?: "min" | "sec" | "hr";
  isRequired?: boolean;
  isDisabled?: boolean;
  isLabelDisabled?: boolean;
  labelClassName?: string;
  className?: string;
}

export default function DurationField<T extends Record<string, any>>({
  name,
  form,
  fieldName,
  placeholder,
  unit,
  isRequired = false,
  isDisabled = false,
  isLabelDisabled,
  labelClassName,
  className,
}: DurationFieldProp<T>) {
  "use no memo";
  const [isFocused, setIsFocused] = useState(false);

  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field, fieldState: { error } }) => (
        <Field>
          {!isLabelDisabled && (
            <FieldLabel className={labelClassName} htmlFor={fieldName}>
              {fieldName}
              {isRequired && <Required />}
            </FieldLabel>
          )}
          <motion.div
            initial={false}
            animate={{ scale: isFocused ? 1.01 : 1 }}
            transition={{ duration: 0.15 }}
            className="relative"
          >
            <InputGroup
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className={cn(
                "text-xs placeholder:text-xs transition-all duration-200 py-5",
                error &&
                  "border-destructive ring-destructive focus-visible:ring-destructive border-2",
                className,
              )}
            >
              <InputGroupInput
                id={fieldName}
                type="text"
                inputMode="numeric"
                autoComplete="off"
                disabled={isDisabled}
                placeholder={placeholder}
                value={field.value ?? ""}
                onChange={(e) => {
                  // Only digits are ever valid — strip everything else
                  // as the ONLY source of truth, no reliance on native
                  // number-input parsing/state.
                  const cleaned = e.target.value.replace(/[^0-9]/g, "");
                  field.onChange(cleaned);
                }}
                onKeyDown={(e) => {
                  // Block paste-independent junk keys outright so the
                  // field never even flashes an invalid character,
                  // not just strips it after the fact.
                  if (["e", "E", "+", "-", ".", ","].includes(e.key)) {
                    e.preventDefault();
                  }
                }}
                onBlur={field.onBlur}
                className="text-xs placeholder:text-xs transition-all duration-200"
              />
              {unit && (
                <InputGroupAddon align="inline-end">
                  <span className="text-xs text-muted-foreground font-medium select-none">
                    {unit}
                  </span>
                </InputGroupAddon>
              )}
            </InputGroup>
          </motion.div>
          {error?.message && <FieldError>{error.message}</FieldError>}
        </Field>
      )}
    />
  );
}
