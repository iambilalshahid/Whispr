"use client";

import * as React from "react";
import { Controller, Path, UseFormReturn } from "react-hook-form";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface TagInputFieldProp<T extends Record<string, any>> {
  name: Path<T>;
  form: UseFormReturn<T>;
  fieldName: string;
  placeholder?: string;
}

export default function TagInputField<T extends Record<string, any>>({
  name,
  form,
  fieldName,
  placeholder = "Type tag and press Enter...",
}: TagInputFieldProp<T>) {
  "use no memo";
  const [inputValue, setInputValue] = React.useState("");

  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const tags: string[] = Array.isArray(value) ? value : [];

        const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            const trimmedValue = inputValue.trim().replace(/,$/, "");

            if (trimmedValue && !tags.includes(trimmedValue)) {
              const updatedTags = [...tags, trimmedValue];
              onChange(updatedTags);
            }
            setInputValue("");
          } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
            const updatedTags = tags.slice(0, -1);
            onChange(updatedTags);
          }
        };

        const removeTag = (tagToRemove: string) => {
          const updatedTags = tags.filter((t) => t !== tagToRemove);
          onChange(updatedTags);
        };

        return (
          <Field>
            <FieldLabel htmlFor={name}>{fieldName}</FieldLabel>

            <div
              className={cn(
                "flex flex-wrap items-center gap-2 min-h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
                error ? "border-destructive focus-within:ring-destructive" : "",
              )}
            >
              {/* Render Tag Badges */}
              <AnimatePresence mode="popLayout">
                {tags.map((tag) => (
                  <motion.span
                    key={tag}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.15 }}
                    className="inline-flex items-center gap-1 bg-brand/10 text-brand font-medium text-xs px-2.5 py-1 rounded-full border border-brand/20 select-none"
                  >
                    {tag}
                    <Button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="rounded-full transition-colors cursor-pointer h-auto p-0.5"
                    >
                      <X className="size-3" />
                    </Button>
                  </motion.span>
                ))}
              </AnimatePresence>

              {/* Shadcn Input Block */}
              <Input
                id={name}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={tags.length === 0 ? placeholder : ""}
                className="flex-1 min-w-[120px] bg-transparent border-none p-0 h-auto outline-none focus-visible:ring-0 focus-visible:border-none placeholder:text-muted-foreground text-sm disabled:cursor-not-allowed shadow-none"
              />
            </div>

            {error && (
              <FieldError className="text-destructive">
                {error.message}
              </FieldError>
            )}
          </Field>
        );
      }}
    />
  );
}
