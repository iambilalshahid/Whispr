import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { Controller, type Path, type UseFormReturn } from "react-hook-form";
import Required from "../Required";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface IFormSchema<T extends Record<string, any>> {
  name: Path<T>;
  form: UseFormReturn<T>;
  fieldName: string;
  placeholder?: string;
  list: Array<string>;
  isRequired?: boolean;
  className?: string;
  onChange?: (value: string) => void;
}

export default function CustomSelectField<T extends Record<string, any>>({
  form,
  name,
  isRequired = false,
  fieldName,
  placeholder = "Select a Location",
  list,
  className,
  onChange,
}: IFormSchema<T>) {
  "use no memo";
  return (
    <>
      <Controller
        name={name}
        control={form.control}
        render={({ field, fieldState: { error } }) => (
          <Field id={name}>
            <FieldLabel className="inline justify-start items-start leading-snug">
              {fieldName}
              {isRequired && <Required />}
            </FieldLabel>
            <Select
              onValueChange={(value) => {
                field.onChange(value);
                if (onChange) onChange(value);
              }}
              value={Array.isArray(field.value) ? field.value[0] : field.value}
            >
              <SelectTrigger
                className={cn(
                  "w-full h-[46px] px-4 rounded-xl bg-white/[0.06] hover:bg-white/[0.08] focus:bg-white/[0.1] border border-white/[0.08] focus:border-white/20 text-white placeholder:text-zinc-500 text-[13.5px] outline-none transition-all",
                  error && "border-destructive ring-destructive border-2",
                  className,
                )}
              >
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent
                className={cn(
                  "w-[250px] p-1.5 z-50 rounded-xl bg-zinc-900/95 backdrop-blur-md border border-white/[0.1] text-zinc-200 shadow-2xl",
                  className,
                )}
              >
                {list.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {error?.message && <FieldError>{error.message}</FieldError>}
          </Field>
        )}
      />
    </>
  );
}
