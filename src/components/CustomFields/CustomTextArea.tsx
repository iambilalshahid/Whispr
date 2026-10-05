import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Controller, type Path, type UseFormReturn } from "react-hook-form";
import Required from "../Required";
import { Textarea } from "../ui/textarea";

const heightClasses = {
  sm: "h-20", // 5rem
  md: "h-32", // 8rem
  lg: "h-40", // 10rem
  xl: "h-52", // 13rem
};

type FieldHeight = keyof typeof heightClasses;

interface IFormSchema<T extends Record<string, any>> {
  name: Path<T>;
  form: UseFormReturn<T>;
  fieldName: string;
  placeholder?: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  fieldHeight?: FieldHeight;
}

export default function CustomTextArea<T extends Record<string, any>>({
  name,
  fieldName,
  isDisabled = false,
  form,
  isRequired = false,
  placeholder = "Select a Location",
  fieldHeight,
}: IFormSchema<T>) {
  "use no memo";
  return (
    <>
      <Controller
        name={name}
        control={form.control}
        render={({ field, fieldState: { error } }) => (
          <Field id={name}>
            <FieldLabel htmlFor={fieldName}>
              {fieldName}
              {isRequired && <Required />}
            </FieldLabel>
            <Textarea
              id={fieldName}
              disabled={isDisabled}
              placeholder={placeholder}
              {...field}
              className={`resize-none break-all break-words w-full ${fieldHeight ? heightClasses[fieldHeight] : "max-h-32"} ${
                error ? "border-destructive ring-destructive border-2" : ""
              }`}
            />
            <FieldError>{error?.message}</FieldError>
          </Field>
        )}
      />
    </>
  );
}
