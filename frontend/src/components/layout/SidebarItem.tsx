import type { LucideIcon } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "../../lib/utils";

type SidebarItemProps = {
  to: string;
  label: string;
  icon: LucideIcon;
};

export function SidebarItem({ to, label, icon: Icon }: SidebarItemProps) {
  return (
    <NavLink
      className={({ isActive }) =>
        cn(
          "flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white",
          isActive && "bg-brand-50 text-brand-700 dark:bg-brand-950/50 dark:text-brand-200",
        )
      }
      to={to}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
      {label}
    </NavLink>
  );
}
