"use client";

import { Field, FieldError, FieldLabel, FieldDescription } from "@/components/ui/field";
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

interface MarksFieldProp<T extends Record<string, any>> {
  name: Path<T>;
  form: UseFormReturn<T>;
  fieldName: string;
  placeholder?: string;
  min?: number;
  max?: number;
  isRequired?: boolean;
  isDisabled?: boolean;
  isLabelDisabled?: boolean;
  labelClassName?: string;
  className?: string;
  isDecimal?: boolean;
  description?: string;
  suffix?: string;
}

export default function MarksField<T extends Record<string, any>>({
  name,
  form,
  fieldName,
  placeholder,
  min = 0,
  max,
  isRequired = false,
  isDisabled = false,
  isLabelDisabled,
  labelClassName,
  className,
  isDecimal = false,
  description,
  suffix,
}: MarksFieldProp<T>) {
  "use no memo";
  const [isFocused, setIsFocused] = useState(false);

  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field, fieldState: { error } }) => {

        return (
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
                onBlur={() => {
                  setIsFocused(false);
                  let raw = String(field.value ?? "");
                  if (isDecimal && raw.endsWith(".")) {
                    raw = raw.slice(0, -1);
                  }
                  if (
                    raw !== "" &&
                    typeof min === "number" &&
                    Number(raw) < min
                  ) {
                    field.onChange(String(min));
                  } else if (raw !== String(field.value ?? "")) {
                    field.onChange(raw);
                  }
                  field.onBlur();
                }}
                className={cn(
                  "text-xs transition-all duration-200 py-5",
                  error &&
                  "border-destructive focus-visible:ring-destructive border-2",
                  className,
                )}
              >
                <InputGroupInput
                  id={fieldName}
                  type="text"
                  inputMode={isDecimal ? "decimal" : "numeric"}
                  autoComplete="off"
                  disabled={isDisabled}
                  placeholder={placeholder}
                  value={field.value ?? ""}
                  onChange={(e) => {
                    let val = e.target.value;
                    if (isDecimal) {
                      if (val !== "" && !/^\d*\.?5?$/.test(val)) {
                        return;
                      }
                    } else {
                      val = val.replace(/[^0-9]/g, "");
                    }

                    // Reject values that exceed max, live, as they're typed.
                    if (val !== "" && typeof max === "number") {
                      const num = Number(val);
                      if (num > max) return; // ignore this keystroke entirely
                    }

                    field.onChange(val);
                  }}
                  onKeyDown={(e) => {
                    const keysToPrevent = isDecimal
                      ? ["e", "E", "+", "-"]
                      : ["e", "E", "+", "-", ".", ","];
                    if (keysToPrevent.includes(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  className="text-xs transition-all duration-200"
                />
                {typeof max === "number" && (
                  <InputGroupAddon align="inline-end">
                    <span className="text-xs text-muted-foreground font-medium select-none">
                      / {max}{suffix ? ` ${suffix}` : ""}
                    </span>
                  </InputGroupAddon>
                )}
              </InputGroup>
            </motion.div>
            {description && (
              <FieldDescription className="text-[10px] text-muted-foreground mt-1">
                {description}
              </FieldDescription>
            )}
            {error?.message && <FieldError>{error.message}</FieldError>}
          </Field>
        );
      }}
    />
  );
}
