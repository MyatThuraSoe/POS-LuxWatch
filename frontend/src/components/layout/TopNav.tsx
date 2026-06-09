import { Menu, Moon, Sun } from "lucide-react";
import { Button } from "../ui/button";
import { UserMenu } from "./UserMenu";
import { useAppStore } from "../../stores/appStore";

export function TopNav() {
  const theme = useAppStore((state) => state.theme);
  const toggleTheme = useAppStore((state) => state.toggleTheme);
  const toggleSidebar = useAppStore((state) => state.toggleSidebar);

  return (
    <header className="flex h-[var(--luxwatch-header-height)] items-center justify-between border-b border-slate-200 bg-white px-4 dark:border-slate-800 dark:bg-slate-950 sm:px-6">
      <div className="flex items-center gap-3">
        <Button className="lg:hidden" onClick={toggleSidebar} size="icon" variant="ghost">
          <Menu className="h-5 w-5" />
        </Button>
        <div>
          <p className="text-sm font-semibold text-slate-950 dark:text-slate-50">
            Business Console
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Authentication and layout shell
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button aria-label="Toggle theme" onClick={toggleTheme} size="icon" variant="ghost">
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
        <UserMenu />
      </div>
    </header>
  );
}
