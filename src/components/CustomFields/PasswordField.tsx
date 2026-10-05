import { cn } from "@/lib/utils";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Controller, Path, UseFormReturn } from "react-hook-form";
import { AnimatedEye } from "./AnimatedEye";
import Required from "../Required";
import { LucideIcon } from "lucide-react";
import React from "react";

interface InputFieldProp<T extends Record<string, any>>
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "form"> {
  name: Path<T>;
  form: UseFormReturn<T>; // Now this 'form' won't conflict
  fieldName: string;
  isRequired: boolean;
  labelClassName?: string & {};
  Icon?: LucideIcon | React.ComponentType<any>;
}

export default function PasswordField<T extends Record<string, any>>({
  name,
  form,
  fieldName,
  placeholder,
  labelClassName,
  isRequired,
  Icon,
  ...props
}: InputFieldProp<T>) {
  "use no memo";
  const [isShow, setShow] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  return (
    <>
      <Controller
        name={name}
        control={form.control}
        render={({ field, fieldState: { error } }) => (
          <Field>
            <FieldLabel className={labelClassName} htmlFor={fieldName}>
              {fieldName}
              {isRequired && <Required />}
            </FieldLabel>
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
                {Icon && (
                  <InputGroupAddon align={"inline-start"}>
                    <Icon size={18} className="text-zinc-400" />
                  </InputGroupAddon>
                )}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={isShow ? "text" : "password"}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="relative w-full"
                  >
                    <InputGroupInput
                      id={fieldName}
                      autoComplete={props.autoComplete ?? "current-password"}
                      {...props}
                      {...field}
                      value={field.value ?? ""}
                      type={isShow ? "text" : "password"}
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
                <InputGroupAddon
                  align={"inline-end"}
                  className="cursor-pointer"
                  onClick={() => setShow(!isShow)}
                >
                  <AnimatedEye isOpen={isShow} />
                </InputGroupAddon>
              </InputGroup>
            </motion.div>
            {/* Input, Select, Switch, etc. */}
            {error?.message && <FieldError>{error.message}</FieldError>}
          </Field>
        )}
      />
    </>
  );
}
