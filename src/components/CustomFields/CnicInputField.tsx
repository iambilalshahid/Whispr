import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { cn } from "@/lib/utils";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { useState } from "react";
import { Controller, Path, UseFormReturn } from "react-hook-form";
import Required from "../Required";
import { AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";

interface CNICInputFieldProp<T extends Record<string, any>>
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "form" | "onChange" | "value"
  > {
  name: Path<T>;
  form: UseFormReturn<T>;
  fieldName?: string;
  labelClassName?: string & {};
  Icon?: LucideIcon;
  RightIcon?: LucideIcon;
  isRequired?: boolean;
  isLabelDisabled?: boolean;
  onClear?: () => void;
}

function formatCNIC(rawDigits: string) {
  const digits = rawDigits.replace(/\D/g, "").slice(0, 13);

  let formatted = digits;
  if (digits.length > 5 && digits.length <= 12) {
    formatted = `${digits.slice(0, 5)}-${digits.slice(5)}`;
  } else if (digits.length > 12) {
    formatted = `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12)}`;
  }
  return formatted;
}

function extractDigits(value: string) {
  return value.replace(/\D/g, "");
}

export default function CNICInputField<T extends Record<string, any>>({
  name,
  form,
  fieldName,
  placeholder = "00000-0000000-0",
  isRequired,
  isLabelDisabled,
  RightIcon,
  labelClassName,
  onClear,
  Icon,
  ...props
}: CNICInputFieldProp<T>) {
  "use no memo";
  const [isFocused, setIsFocused] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  return (
    <>
      <Controller
        name={name}
        control={form.control}
        render={({ field, fieldState: { error } }) => {
          const hasValue = !!field.value;

          const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const inputValue = e.target.value;
            const previousDigitsCount = extractDigits(field.value ?? "").length;
            const nextDigitsCount = extractDigits(inputValue).length;

            let digits = extractDigits(inputValue);
            if (
              inputValue.length < (field.value?.length ?? 0) &&
              nextDigitsCount === previousDigitsCount
            ) {
              digits = digits.slice(0, -1);
            }

            const formatted = formatCNIC(digits);
            field.onChange(formatted);

            setIsTyping(true);
            setTimeout(() => setIsTyping(false), 120);
          };

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
                animate={{
                  scale: isFocused ? 1.01 : 1,
                }}
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
                  )}
                >
                  <InputGroupAddon align={"inline-start"}>
                    {Icon && <Icon />}
                  </InputGroupAddon>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={"text"}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      className="relative w-full"
                    >
                      <InputGroupInput
                        {...props}
                        type="text"
                        inputMode="numeric"
                        autoComplete="off"
                        id={fieldName}
                        placeholder={placeholder}
                        value={field.value ?? ""}
                        onChange={handleChange}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                        maxLength={15}
                        className={cn(
                          "text-xs placeholder:text-xs transition-all duration-200",
                          isTyping && "scale-[1.01]",
                        )}
                      />
                    </motion.div>
                  </AnimatePresence>
                  <InputGroupAddon align={"inline-end"}>
                    <AnimatePresence mode="wait">
                      {RightIcon && hasValue && (
                        <Button
                          size={"icon"}
                          type="button"
                          variant={"ghost"}
                          key="right-icon"
                          onClick={() => {
                            form.setValue(name, "" as any, {
                              shouldValidate: true,
                              shouldDirty: true,
                              shouldTouch: true,
                            });
                            form.setFocus(name);
                            onClear?.();
                          }}
                          className="hover:text-destructive transition-colors cursor-pointer"
                          aria-label="Clear input"
                        >
                          <RightIcon className="size-4" />
                        </Button>
                      )}
                    </AnimatePresence>
                  </InputGroupAddon>
                </InputGroup>
              </motion.div>
              {error?.message && <FieldError>{error.message}</FieldError>}
            </Field>
          );
        }}
      />
    </>
  );
}
