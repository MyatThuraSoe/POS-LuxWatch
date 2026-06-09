import type { ReactNode } from "react";
import { useAuthStore, type UserRoleName } from "../../stores/authStore";

type RoleGuardProps = {
  allowedRoles: UserRoleName[];
  children: ReactNode;
  fallback?: ReactNode;
};

export function RoleGuard({ allowedRoles, children, fallback = null }: RoleGuardProps) {
  const userRoles = useAuthStore((state) => state.user?.roles ?? []);
  const allowed = userRoles.some((role) => allowedRoles.includes(role));

  return allowed ? children : fallback;
}
