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

interface InputFieldProp<T extends Record<string, any>>
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "form"> {
  name: Path<T>;
  form: UseFormReturn<T>; // Now this 'form' won't conflict
  fieldName?: string;
  labelClassName?: string & {};
  Icon?: LucideIcon;
  RightIcon?: LucideIcon;
  isRequired?: boolean;
  isLabelDisabled?: boolean;
  onClear?: () => void;
}

export default function InputField<T extends Record<string, any>>({
  name,
  form,
  fieldName,
  placeholder,
  isRequired,
  isLabelDisabled,
  RightIcon,
  // type = 'text',
  labelClassName,
  onClear,
  Icon,
  ...props
}: InputFieldProp<T>) {
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
          return (
            <Field className="min-w-0">
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
                    "w-full h-[46px] rounded-xl bg-white/[0.06] hover:bg-white/[0.08] focus-within:bg-white/[0.1] border border-white/[0.08] focus-within:border-white/20 text-white placeholder:text-zinc-500 text-[13.5px] outline-none transition-all",
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
                        {...field}
                        value={field.value ?? ""}
                        type={props.type || "text"}
                        id={fieldName}
                        placeholder={placeholder}
                        onChange={(e) => {
                          field.onChange(e);

                          setIsTyping(true);
                          setTimeout(() => setIsTyping(false), 120);
                        }}
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
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
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
              {/* Input, Select, Switch, etc. */}
              {error?.message && <FieldError>{error.message}</FieldError>}
            </Field>
          );
        }}
      />
    </>
  );
}
