import type { ReactNode } from "react";
import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { LoadingSkeleton } from "../common";
import { useCurrentUser } from "../../hooks/useAuth";
import { useAuthStore } from "../../stores/authStore";

type ProtectedRouteProps = {
  children: ReactNode;
};

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();
  const token = useAuthStore((state) => state.token);
  const setIntendedPath = useAuthStore((state) => state.setIntendedPath);
  const currentUser = useCurrentUser();

  useEffect(() => {
    if (!token) {
      setIntendedPath(`${location.pathname}${location.search}`);
    }
  }, [location.pathname, location.search, setIntendedPath, token]);

  if (!token) {
    return <Navigate replace to="/login" />;
  }

  if (currentUser.isLoading) {
    return (
      <main className="container-shell flex min-h-screen items-center justify-center">
        <div className="w-full max-w-sm">
          <LoadingSkeleton lines={4} />
        </div>
      </main>
    );
  }

  return children;
}
