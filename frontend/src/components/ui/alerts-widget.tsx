import { AlertTriangle } from "lucide-react";
import type { InventoryAlert } from "../../types/user";
import { cn } from "../../lib/utils";

type AlertsWidgetProps = {
  alerts: InventoryAlert[];
  loading?: boolean;
};

export function AlertsWidget({ alerts, loading = false }: AlertsWidgetProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-md border border-slate-200 p-3 dark:border-slate-800"
          >
            <div className="h-8 w-8 shrink-0 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-3 w-1/4 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!alerts || alerts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30">
          ✓
        </div>
        <p className="text-sm font-medium text-slate-900 dark:text-slate-50">All stock levels OK</p>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">No low stock alerts</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {alerts.slice(0, 5).map((alert) => {
        const severity =
          alert.current_quantity === 0
            ? "critical"
            : alert.current_quantity < alert.low_stock_threshold * 0.5
              ? "high"
              : "medium";

        return (
          <div
            key={alert.id}
            className={cn(
              "flex items-center gap-3 rounded-md border p-3",
              severity === "critical"
                ? "border-rose-200 bg-rose-50 dark:border-rose-900 dark:bg-rose-950/30"
                : severity === "high"
                  ? "border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30"
                  : "border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50",
            )}
          >
            <AlertTriangle
              className={cn(
                "h-5 w-5 shrink-0",
                severity === "critical"
                  ? "text-rose-600"
                  : severity === "high"
                    ? "text-amber-600"
                    : "text-slate-400",
              )}
            />
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-50">
                {alert.product_name}
                {alert.variant_name ? ` - ${alert.variant_name}` : ""}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {alert.current_quantity} / {alert.low_stock_threshold} in stock
              </p>
            </div>
          </div>
        );
      })}
      {alerts.length > 5 && (
        <p className="pt-2 text-center text-xs text-slate-500 dark:text-slate-400">
          +{alerts.length - 5} more alerts
        </p>
      )}
    </div>
  );
}
