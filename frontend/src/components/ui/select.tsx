import type { SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../../lib/utils";
import type { SelectOption } from "../../types";

type SelectProps<TValue extends string | number = string> =
  SelectHTMLAttributes<HTMLSelectElement> & {
    options?: SelectOption<TValue>[];
    placeholder?: string;
    // compatibility: onValueChange used by some pages
    onValueChange?: (value: TValue) => void;
  };

export function Select<TValue extends string | number = string>({
  className,
  options,
  placeholder,
  onValueChange,
  onChange,
  children,
  ...props
}: SelectProps<TValue>) {
  const handleChange: SelectHTMLAttributes<HTMLSelectElement>['onChange'] = (e) => {
    onChange?.(e as any);
    if (onValueChange) {
      const val = (e.target as HTMLSelectElement).value as unknown as TValue;
      onValueChange(val);
    }
  };
  return (
    <div className="relative">
      <select
        className={cn(
          "h-10 w-full appearance-none rounded-md border border-slate-200 bg-white px-3 pr-9 text-sm text-slate-900 transition duration-200 focus-visible:focus-ring disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-70 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-50 dark:disabled:bg-slate-900",
          className,
        )}
        onChange={handleChange}
        {...props}
      >
        {placeholder ? <option value="">{placeholder}</option> : null}
        {options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
        {children}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
        aria-hidden="true"
      />
    </div>
  );
}

export function SelectContent({ children }: { children?: React.ReactNode }) {
  return <div>{children}</div>;
}

export function SelectItem({ children, value, ...rest }: { children?: React.ReactNode; value?: string | number } & Record<string, any>) {
  return (
    <div data-value={value} {...(rest as any)}>
      {children}
    </div>
  );
}

export function SelectTrigger({ children }: { children?: React.ReactNode }) {
  return <>{children}</>;
}

export function SelectValue({ children, placeholder }: { children?: React.ReactNode; placeholder?: string }) {
  return <>{children ?? placeholder}</>;
}
