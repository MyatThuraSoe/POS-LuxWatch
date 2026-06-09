import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactElement } from "react";
import { cloneElement } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-md px-4 text-sm font-medium transition duration-200 focus-visible:focus-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        // compatibility alias
        default: "bg-brand-700 text-white shadow-sm hover:bg-brand-600",
        primary: "bg-brand-700 text-white shadow-sm hover:bg-brand-600",
        secondary:
          "bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-50 dark:hover:bg-slate-700",
        outline:
          "border border-slate-200 bg-white text-slate-900 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-50 dark:hover:bg-slate-900",
        ghost: "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800",
        danger: "bg-danger text-white shadow-sm hover:bg-rose-600",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4 text-sm",
        lg: "h-11 px-5 text-base",
        icon: "h-10 w-10 px-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: false;
  };

type ButtonAsChildProps = AnchorHTMLAttributes<HTMLAnchorElement> &
  VariantProps<typeof buttonVariants> & {
    asChild: true;
    children: ReactElement<{ className?: string }>;
  };

export function Button(props: ButtonProps | ButtonAsChildProps) {
  const { className, variant, size } = props;

  if (props.asChild) {
    const { children, asChild: _asChild, ...childProps } = props;
    return cloneElement(children, {
      ...childProps,
      className: cn(buttonVariants({ variant, size }), children.props.className, className),
    });
  }

  const { type = "button", asChild: _asChild, ...buttonProps } = props;
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      type={type}
      {...buttonProps}
    />
  );
}

// Export variants for other components that may reference them
export { buttonVariants };
