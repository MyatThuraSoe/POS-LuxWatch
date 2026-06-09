import type { UserStatus } from "../../types/user";
import { cn } from "../../lib/utils";

type UserStatusBadgeProps = {
  status: UserStatus;
  className?: string;
};

export function UserStatusBadge({ status, className }: UserStatusBadgeProps) {
  const variants = {
    active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    inactive: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
    suspended: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
  };

  const labels = {
    active: "Active",
    inactive: "Inactive",
    suspended: "Suspended",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variants[status],
        className,
      )}
    >
      {labels[status]}
    </span>
  );
}
