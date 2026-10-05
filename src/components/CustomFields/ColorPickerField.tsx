"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { RotateCcw } from "lucide-react";
import { Controller, FieldValues, Path, UseFormReturn } from "react-hook-form";

interface ColorPickerFieldProps<T extends FieldValues> {
  name: Path<T>;
  form: UseFormReturn<T, any>;
  fieldName: string;
  placeholder?: string;
  presets?: string[];
  className?: string;
}

const DEFAULT_PRESETS = [
  "#0f172a", // Slate 900
  "#1e293b", // Slate 800
  "#2563eb", // Blue 600
  "#4f46e5", // Indigo 600
  "#7c3aed", // Violet 600
  "#059669", // Emerald 600
  "#d97706", // Amber 600
  "#e11d48", // Rose 600
  "#ffffff", // White
  "#f1f5f9", // Slate 100
];

export default function ColorPickerField<T extends FieldValues>({
  name,
  form,
  fieldName,
  placeholder = "#1e293b",
  presets = DEFAULT_PRESETS,
  className,
}: ColorPickerFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field: { value, onChange }, fieldState: { error } }) => {
        const hexValue = value || "";
        const validColor = /^#[0-9A-Fa-f]{6}$/.test(hexValue)
          ? hexValue
          : "#000000";

        return (
          <Field className={cn("space-y-1.5", className)}>
            <div className="flex items-center justify-between">
              <FieldLabel className="text-xs font-semibold text-foreground">
                {fieldName}
              </FieldLabel>
              {hexValue && (
                <Button
                  type="button"
                  variant="ghost"
                  size="xs"
                  onClick={() => onChange("")}
                  className="text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-1 cursor-pointer transition-colors h-auto p-1"
                  title="Clear / Reset color"
                >
                  <RotateCcw className="h-3 w-3" />
                  Clear
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Native Color Input wrapper */}
              <div className="relative shrink-0 w-10 h-10 rounded-lg border border-border overflow-hidden shadow-2xs hover:border-primary/50 transition-colors cursor-pointer">
                <input
                  type="color"
                  value={validColor}
                  onChange={(e) => onChange(e.target.value)}
                  className="absolute -inset-2 w-14 h-14 cursor-pointer opacity-0"
                  title="Pick a color"
                />
                <div
                  className="w-full h-full"
                  style={{
                    backgroundColor: hexValue || "transparent",
                    backgroundImage: !hexValue
                      ? "linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)"
                      : undefined,
                    backgroundSize: "8px 8px",
                  }}
                />
              </div>

              {/* Text input for hex code */}
              <Input
                type="text"
                value={hexValue}
                onChange={(e) => {
                  let val = e.target.value;
                  if (val && !val.startsWith("#")) {
                    val = `#${val}`;
                  }
                  onChange(val);
                }}
                placeholder={placeholder}
                maxLength={7}
                className="font-mono text-xs uppercase h-10 flex-1"
              />
            </div>

            {/* Quick preset chips */}
            {presets && presets.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                {presets.map((color) => (
                  <Button
                    key={color}
                    type="button"
                    variant="ghost"
                    onClick={() => onChange(color)}
                    style={{ backgroundColor: color }}
                    className={cn(
                      "w-5 h-5 rounded-md border border-border/80 shadow-2xs transition-transform hover:scale-115 cursor-pointer p-0 min-w-0 min-h-0",
                      hexValue?.toLowerCase() === color.toLowerCase() &&
                      "ring-2 ring-primary ring-offset-1"
                    )}
                    title={color}
                  />
                ))}
              </div>
            )}

            {error?.message && <FieldError>{error.message}</FieldError>}
          </Field>
        );
      }}
    />
  );
}
