import type { InputHTMLAttributes, ReactNode } from "react";
import { Input } from "../ui/input";

type FormFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  hint?: ReactNode;
};

export function FormField({ id, label, error, hint, ...inputProps }: FormFieldProps) {
  const inputId = id ?? inputProps.name ?? label.toLowerCase().replace(/\s+/g, "-");
  const errorId = `${inputId}-error`;

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-800 dark:text-slate-200" htmlFor={inputId}>
        {label}
      </label>
      <Input
        id={inputId}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        {...inputProps}
      />
      {hint && !error ? <p className="text-xs text-slate-500 dark:text-slate-400">{hint}</p> : null}
      {error ? (
        <p className="text-xs font-medium text-danger" id={errorId}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
