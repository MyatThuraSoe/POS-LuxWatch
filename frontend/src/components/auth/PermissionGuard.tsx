import type { ReactNode } from "react";
import { useAuthStore } from "../../stores/authStore";

type PermissionGuardProps = {
  permissions: string[];
  children: ReactNode;
  fallback?: ReactNode;
};

export function PermissionGuard({ permissions, children, fallback = null }: PermissionGuardProps) {
  const userPermissions = useAuthStore((state) => state.user?.permissions ?? []);
  const allowed = permissions.some((permission) => userPermissions.includes(permission));

  return allowed ? children : fallback;
}
