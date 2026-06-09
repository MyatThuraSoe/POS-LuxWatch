import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

type StatCardProps = {
  label: string;
  value: string;
  detail?: string;
  icon?: ReactNode;
  className?: string;
};

export function StatCard({ label, value, detail, icon, className }: StatCardProps) {
  return (
    <article className={cn("surface-panel rounded-md p-4", className)}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
          {label}
        </p>
        {icon ? <div className="text-slate-500 dark:text-slate-400">{icon}</div> : null}
      </div>
      <p className="mt-3 text-xl font-semibold text-slate-950 dark:text-slate-50">{value}</p>
      {detail ? <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{detail}</p> : null}
    </article>
  );
}
