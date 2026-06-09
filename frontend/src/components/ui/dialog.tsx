import type { ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "./button";

type DialogProps = {
  open?: boolean;
  title?: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
  onClose?: () => void;
  onOpenChange?: (open: boolean) => void;
  className?: string;
};

export function Dialog({
  open = false,
  title,
  description,
  children,
  footer,
  onClose,
  onOpenChange,
  className,
}: DialogProps) {
  const handleClose = () => {
    if (onClose) onClose();
    if (onOpenChange) onOpenChange(false);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
      role="presentation"
    >
      <section
        aria-modal="true"
        role="dialog"
        aria-labelledby="dialog-title"
        className={cn(
          "w-full max-w-lg rounded-md border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900",
          className,
        )}
      >
        <header className="flex items-start justify-between gap-4 border-b border-slate-200 p-5 dark:border-slate-800">
          <div>
            {title ? (
              <h2 className="text-base font-semibold text-slate-950 dark:text-slate-50" id="dialog-title">
                {title}
              </h2>
            ) : null}
            {description ? <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{description}</p> : null}
          </div>
          <Button aria-label="Close dialog" onClick={handleClose} size="icon" variant="ghost">
            <X className="h-4 w-4" />
          </Button>
        </header>
        <div className="p-5">{children}</div>
        {footer ? (
          <footer className="flex justify-end gap-2 border-t border-slate-200 p-5 dark:border-slate-800">{footer}</footer>
        ) : null}
      </section>
    </div>
  );
}

// Backwards-compatible named exports used in older code
export const DialogContent = Dialog;
export function DialogHeader({ children, className }: { children?: ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}
export function DialogTitle({ children, className }: { children?: ReactNode; className?: string }) {
  return <h2 id="dialog-title" className={className}>{children}</h2>;
}
export function DialogDescription({ children, className }: { children?: ReactNode; className?: string }) {
  return <p className={cn("text-sm text-slate-600 dark:text-slate-400", className)}>{children}</p>;
}
export function DialogFooter({ children, className }: { children?: ReactNode; className?: string }) {
  return <div className={cn("flex justify-end gap-2", className)}>{children}</div>;
}
export function DialogTrigger({ children, asChild }: { children?: ReactNode; asChild?: boolean }) {
  // No-op compatibility component: pages typically render a button here
  return <>{children}</>;
}
