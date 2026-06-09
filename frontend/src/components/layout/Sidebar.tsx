import {
  BarChart3,
  Boxes,
  Gauge,
  Receipt,
  Settings,
  ShoppingCart,
  Users,
  Wrench,
} from "lucide-react";
import { NavLogo } from "./NavLogo";
import { SidebarItem } from "./SidebarItem";
import { SidebarSection } from "./SidebarSection";
import { cn } from "../../lib/utils";
import { useAuthStore } from "../../stores/authStore";

const operationsItems = [
  { to: "/dashboard", label: "Dashboard", icon: Gauge, allowedRoles: ["admin", "owner"] },
  { to: "/pos", label: "POS", icon: ShoppingCart, allowedRoles: ["admin", "owner", "employee"] },
  { to: "/inventory", label: "Inventory", icon: Boxes, allowedRoles: ["admin", "owner"] },
  { to: "/customers", label: "Customers", icon: Users, allowedRoles: ["admin", "owner", "employee"] },
  { to: "/repairs", label: "Repairs", icon: Wrench, allowedRoles: ["admin", "owner"] },
];

const managementItems = [
  { to: "/reports", label: "Reports", icon: BarChart3, allowedRoles: ["admin", "owner"] },
  { to: "/receipts", label: "Receipts", icon: Receipt, allowedRoles: ["admin", "owner", "employee"] },
  { to: "/settings", label: "Settings", icon: Settings, allowedRoles: ["admin", "owner"] },
];

type SidebarProps = {
  className?: string;
  showLogo?: boolean;
};

export function Sidebar({ className, showLogo = true }: SidebarProps) {
  const userRoles = useAuthStore((state) => state.user?.roles ?? []);
  
  const hasRole = (allowedRoles: string[]) => {
    return userRoles.some((role) => allowedRoles.includes(role.toLowerCase()));
  };

  const filteredOperationsItems = operationsItems.filter(item => hasRole(item.allowedRoles));
  const filteredManagementItems = managementItems.filter(item => hasRole(item.allowedRoles));

  return (
    <aside
      className={cn(
        "hidden h-screen w-[var(--luxwatch-sidebar-width)] shrink-0 border-r border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950 lg:block",
        className,
      )}
    >
      {showLogo ? <NavLogo /> : null}
      <nav className={cn("space-y-6", showLogo && "mt-8")} aria-label="Main navigation">
        <SidebarSection title="Operations">
          {filteredOperationsItems.map((item) => (
            <SidebarItem key={item.to} to={item.to} label={item.label} icon={item.icon} />
          ))}
        </SidebarSection>
        <SidebarSection title="Management">
          {filteredManagementItems.map((item) => (
            <SidebarItem key={item.to} to={item.to} label={item.label} icon={item.icon} />
          ))}
        </SidebarSection>
      </nav>
    </aside>
  );
}
