import { X } from "lucide-react";
import { Button } from "../ui/button";
import { NavLogo } from "./NavLogo";
import { Sidebar } from "./Sidebar";
import { useAppStore } from "../../stores/appStore";

export function MobileSidebar() {
  const sidebarOpen = useAppStore((state) => state.sidebarOpen);
  const setSidebarOpen = useAppStore((state) => state.setSidebarOpen);

  if (!sidebarOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <button
        aria-label="Close navigation"
        className="absolute inset-0 bg-slate-950/50"
        onClick={() => setSidebarOpen(false)}
        type="button"
      />
      <aside className="relative h-full w-72 border-r border-slate-200 bg-white p-4 shadow-xl dark:border-slate-800 dark:bg-slate-950">
        <div className="flex items-center justify-between gap-4">
          <NavLogo />
          <Button
            aria-label="Close navigation"
            onClick={() => setSidebarOpen(false)}
            size="icon"
            variant="ghost"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="mt-6">
          <Sidebar
            className="block h-auto w-full border-r-0 bg-transparent p-0 dark:bg-transparent lg:hidden"
            showLogo={false}
          />
        </div>
      </aside>
    </div>
  );
}
