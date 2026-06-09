import { Watch } from "lucide-react";
import { APP_NAME } from "../../config/constants";

export function NavLogo() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-brand-700 text-white">
        <Watch className="h-5 w-5" aria-hidden="true" />
      </div>
      <div>
        <p className="text-sm font-semibold leading-5 text-slate-950 dark:text-slate-50">
          {APP_NAME}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400">POS Console</p>
      </div>
    </div>
  );
}
