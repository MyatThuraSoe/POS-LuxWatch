import type { ReactNode } from "react";
import { Inbox } from "lucide-react";
import { cn } from "../../lib/utils";

type EmptyStateProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
};

export function EmptyState({ title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-md border border-dashed border-slate-300 p-8 text-center dark:border-slate-700",
        className,
      )}
    >
      <Inbox className="h-9 w-9 text-slate-400" aria-hidden="true" />
      <h2 className="mt-4 text-base font-semibold text-slate-900 dark:text-slate-50">{title}</h2>
      {description ? (
        <p className="mt-2 max-w-md text-sm text-slate-600 dark:text-slate-400">{description}</p>
      ) : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
