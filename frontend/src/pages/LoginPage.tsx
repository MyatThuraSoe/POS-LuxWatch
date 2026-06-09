import { Navigate } from "react-router-dom";
import { LoginForm } from "../components/auth";
import { Badge } from "../components/ui/badge";
import { APP_NAME } from "../config/constants";
import { useAuthStore } from "../stores/authStore";

export function LoginPage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate replace to="/dashboard" />;
  }

  return (
    <main className="grid min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50 lg:grid-cols-[1fr_30rem]">
      <section className="hidden bg-slate-950 px-10 py-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div>
          <Badge variant="brand">LuxWatch POS</Badge>
          <h1 className="mt-6 max-w-xl text-4xl font-semibold tracking-tight">
            Watch shop operations, sales, and service in one console.
          </h1>
          <p className="mt-4 max-w-lg text-sm leading-6 text-slate-300">
            Sign in to access POS checkout, inventory controls, warranty workflows, and management
            reports.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-3 text-sm">
          <div className="rounded-md border border-white/10 bg-white/5 p-4">
            <p className="text-slate-400">Roles</p>
            <p className="mt-1 font-semibold">Admin, Owner, Employee</p>
          </div>
          <div className="rounded-md border border-white/10 bg-white/5 p-4">
            <p className="text-slate-400">Access</p>
            <p className="mt-1 font-semibold">Permissions ready</p>
          </div>
          <div className="rounded-md border border-white/10 bg-white/5 p-4">
            <p className="text-slate-400">Backend</p>
            <p className="mt-1 font-semibold">Laravel API</p>
          </div>
        </div>
      </section>

      <section className="flex items-center justify-center px-4 py-10 sm:px-6">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <p className="text-sm font-semibold text-brand-700 dark:text-brand-300">{APP_NAME}</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 dark:text-slate-50">
              Sign in
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Use your staff account to continue.
            </p>
          </div>
          <div className="surface-panel rounded-md p-6">
            <LoginForm />
          </div>
        </div>
      </section>
    </main>
  );
}
