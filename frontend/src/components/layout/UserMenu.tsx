import { LogOut, UserCircle } from "lucide-react";
import { Avatar } from "../ui/avatar";
import { Button } from "../ui/button";
import { useLogoutMutation } from "../../hooks/useAuth";
import { useAuthStore } from "../../stores/authStore";

export function UserMenu() {
  const user = useAuthStore((state) => state.user);
  const logoutMutation = useLogoutMutation();

  return (
    <div className="flex items-center gap-3">
      <Avatar
        className="h-9 w-9"
        imageUrl={user?.avatarUrl ?? undefined}
        name={user?.name ?? "User"}
      />
      <div className="hidden min-w-0 text-right sm:block">
        <p className="truncate text-sm font-medium text-slate-950 dark:text-slate-50">
          {user?.name ?? "User"}
        </p>
        <p className="truncate text-xs text-slate-500 dark:text-slate-400">
          {user?.role ?? "employee"}
        </p>
      </div>
      <Button aria-label="Profile" size="icon" variant="ghost">
        <UserCircle className="h-4 w-4" />
      </Button>
      <Button
        aria-label="Logout"
        disabled={logoutMutation.isPending}
        onClick={() => logoutMutation.mutate()}
        size="icon"
        variant="ghost"
      >
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  );
}
