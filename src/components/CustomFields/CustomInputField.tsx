import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Controller, type Path, type UseFormReturn } from "react-hook-form";
import Required from "../Required";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface IFormSchema<T extends Record<string, any>>
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "name" | "form"> {
  name: Path<T>;
  form: UseFormReturn<T>;
  fieldName: string;
  placeholder?: string;
  isRequired?: boolean;
  isDisabled?: boolean;
}

export default function CustomInputField<T extends Record<string, any>>({
  form,
  name,
  isRequired = false,
  isDisabled = false,
  fieldName,
  placeholder,
  autoComplete,
  type,
  ...props
}: IFormSchema<T>) {
  "use no memo";
  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field, fieldState: { error } }) => (
        <Field id={name}>
          <FieldLabel htmlFor={fieldName}>
            {fieldName}
            {isRequired && <Required />}
          </FieldLabel>
          <Input
            id={fieldName}
            type={type}
            autoComplete={autoComplete}
            disabled={isDisabled}
            placeholder={placeholder}
            {...props}
            {...field}
            value={field.value ?? ""}
            className={cn(
              "w-full h-[46px] px-4 rounded-xl bg-white/[0.06] hover:bg-white/[0.08] focus:bg-white/[0.1] border border-white/[0.08] focus:border-white/20 text-white placeholder:text-zinc-500 text-[13.5px] outline-none transition-all",
              error && "border-destructive ring-destructive border-2",
            )}
          />
          {error?.message && <FieldError>{error.message}</FieldError>}
        </Field>
      )}
    />
  );
}
