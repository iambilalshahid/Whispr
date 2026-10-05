import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { motion, AnimatePresence } from "framer-motion";
import { Controller, Path, UseFormReturn } from "react-hook-form";
import { cn } from "@/lib/utils";
import { OptionProp } from "@/components/CustomFields/DropdownMenuField";

interface SelectFieldProp<T extends Record<string, any>> {
  name: Path<T>;
  form: UseFormReturn<T>;
  fieldName: string;
  placeholder?: string;
  defaultValue?: string;
  options: OptionProp[];
  className?: string;
  triggerClassName?: string;
}

export default function SelectField<T extends Record<string, any>>({
  name,
  form,
  fieldName,
  placeholder,
  options,
  defaultValue,
  className,
  triggerClassName,
}: SelectFieldProp<T>) {
  "use no memo";
  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <Field className={cn("min-w-0", className)}>
          <FieldLabel htmlFor={name}>{fieldName}</FieldLabel>

          <AnimatePresence mode="wait">
            <Select<string>
              onValueChange={(val) => onChange(val ?? "")}
              value={value}
              defaultValue={defaultValue ?? ""}
            >
              <SelectTrigger
                id={name}
                className={cn(
                  "w-full h-[46px] px-4 rounded-xl bg-white/[0.06] hover:bg-white/[0.08] focus:bg-white/[0.1] border border-white/[0.08] focus:border-white/20 text-white placeholder:text-zinc-500 text-[13.5px] outline-none transition-all",
                  error && "border-destructive ring-destructive border-2",
                  triggerClassName,
                )}
              >
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>

              <SelectContent className="p-1.5 z-50 rounded-xl bg-zinc-900/95 backdrop-blur-md border border-white/[0.1] text-zinc-200 shadow-2xl">
                <SelectGroup>
                  <motion.div
                    key="dropdown"
                    initial={{ opacity: 0, scale: 0.9, y: -5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98, y: -5 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                  >
                    {options?.map((option, index) => (
                      <SelectItem
                        value={String(option.value)}
                        key={index}
                        className="font-sans text-sm"
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </motion.div>
                </SelectGroup>
              </SelectContent>
            </Select>
          </AnimatePresence>

          {error && (
            <FieldError className="text-destructive">
              {error.message}
            </FieldError>
          )}
        </Field>
      )}
    />
  );
}
