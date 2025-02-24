"use client";

import { forwardRef, KeyboardEventHandler } from "react";
import { useFormStatus } from "react-dom";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Textarea } from "../ui/textarea";
import { FormErrors } from "./form-errors";

interface FormTextareaProps {
  id: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  errors?: Record<string, string[] | undefined>;
  className?: string;
  defaultValue?: string;
  onBlur?: () => void;
  onClick?: () => void;
  onKeyDown?: KeyboardEventHandler<HTMLTextAreaElement> | undefined;
}

const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  (
    {
      id,
      className,
      defaultValue = "",
      disabled,
      errors,
      label,
      onBlur,
      placeholder,
      required,
      onClick,
      onKeyDown,
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
          <Textarea
            placeholder={placeholder}
            onBlur={onBlur}
            onKeyDown={onKeyDown}
            defaultValue={defaultValue}
            ref={ref}
            required={required}
            id={id}
            name={id}
            disabled={pending || disabled}
            className={cn(
              "resize-none focus-visible:ring-0 focus-visible:ring-offset-0 ring-0 focus:ring-0 outline-none shadow-sm",
              className
            )}
            aria-describedby={`${id}-error`}
            onClick={onClick}
          />
        </div>

        <FormErrors errors={errors} id={id} />
      </div>
    );
  }
);

FormTextarea.displayName = "FormTextarea";

export { FormTextarea };
