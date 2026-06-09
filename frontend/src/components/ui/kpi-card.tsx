import type { ReactNode } from "react";
import { cn } from "../../lib/utils";
import { Spinner } from "./spinner";

type KPICardProps = {
  label: string;
  value: string | number;
  detail?: string;
  icon?: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  loading?: boolean;
  className?: string;
};

export function KPICard({
  label,
  value,
  detail,
  icon,
  trend,
  loading = false,
  className,
}: KPICardProps) {
  return (
    <article className={cn("surface-panel rounded-md p-4", className)}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
          {label}
        </p>
        {icon ? <div className="text-slate-500 dark:text-slate-400">{icon}</div> : null}
      </div>
      
      {loading ? (
        <div className="mt-3 flex items-center gap-2">
          <Spinner size="sm" />
          <div className="h-7 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        </div>
      ) : (
        <p className="mt-3 text-xl font-semibold text-slate-950 dark:text-slate-50">{value}</p>
      )}
      
      {detail ? (
        <div className="mt-1 flex items-center gap-2">
          <p className="text-sm text-slate-600 dark:text-slate-400">{detail}</p>
          {trend ? (
            <span
              className={cn(
                "text-xs font-medium",
                trend.isPositive ? "text-emerald-600" : "text-rose-600",
              )}
            >
              {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
            </span>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}
