"use client";

import { forwardRef, KeyboardEvent } from "react";
import { useFormStatus } from "react-dom";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { FormErrors } from "./form-errors";

interface FormInputProps {
  id: string;
  label?: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  errors?: Record<string, string[] | undefined>;
  className?: string;
  defaultValue?: string;
  onBlur?: () => void;
  onKeyDown?: (e: KeyboardEvent) => void;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      id,
      className,
      defaultValue = "",
      disabled,
      errors,
      label,
      onBlur,
      onKeyDown,
      placeholder,
      required,
      type,
    },
    ref
  ) => {
    const { pending } = useFormStatus();

    return (
      <div className="space-y-2">
        <div className="space-y-1">
          {label ? (
            <Label
              htmlFor={id}
              className="text-sm font-semibold text-neutral-700"
            >
              {label}
            </Label>
          ) : null}
          <Input
            placeholder={placeholder}
            onBlur={onBlur}
            onKeyDown={onKeyDown}
            defaultValue={defaultValue}
            ref={ref}
            required={required}
            id={id}
            name={id}
            type={type}
            disabled={pending || disabled}
            className={cn("text-sm px-2 py-1 h-7", className)}
            aria-describedby={`${id}-error`}
          />
        </div>

        <FormErrors errors={errors} id={id} />
      </div>
    );
  }
);

FormInput.displayName = "FormInput";

export { FormInput };
