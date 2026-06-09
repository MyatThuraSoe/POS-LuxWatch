import { Bell, CheckCircle2, Moon, Server, Sun, Zap } from "lucide-react";
import { toast } from "sonner";
import { EmptyState } from "../components/common/EmptyState";
import { LoadingSkeleton, TableSkeleton } from "../components/common/LoadingSkeleton";
import { PageHeader } from "../components/common/PageHeader";
import { SectionCard } from "../components/common/SectionCard";
import { StatCard } from "../components/common/StatCard";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Spinner } from "../components/ui/spinner";
import { APP_DESCRIPTION, APP_NAME } from "../config/constants";
import { useAppStore } from "../stores/appStore";

const foundationStats = [
  {
    label: "Framework",
    value: "React 19",
    detail: "Vite and strict TypeScript",
    icon: <Zap className="h-5 w-5" aria-hidden="true" />,
  },
  {
    label: "Server state",
    value: "Query v5",
    detail: "Central query client and keys",
    icon: <Server className="h-5 w-5" aria-hidden="true" />,
  },
  {
    label: "App state",
    value: "Zustand",
    detail: "Theme, sidebar, notifications",
    icon: <Bell className="h-5 w-5" aria-hidden="true" />,
  },
];

const completedItems = [
  "Root providers, error boundary, toasts, and theme sync",
  "API client with environment validation and CSRF header setup",
  "Reusable buttons, inputs, badges, cards, skeletons, dialogs, selects, and form fields",
  "Query key factory, health check hook, validators, global types, and utility exports",
];

export function HomePage() {
  const theme = useAppStore((state) => state.theme);
  const toggleTheme = useAppStore((state) => state.toggleTheme);
  const pushNotification = useAppStore((state) => state.pushNotification);

  const showFoundationToast = () => {
    pushNotification({
      title: "Foundation check",
      message: "Phase 1 frontend shell is wired and ready.",
      variant: "success",
    });

    toast.success("Foundation check passed", {
      description: "Providers, theme state, and notification plumbing are active.",
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50">
      <main className="container-shell py-6 sm:py-8">
        <PageHeader
          eyebrow="LuxWatch frontend"
          title="Phase 1 foundation"
          description={`${APP_NAME} is ready for feature work: ${APP_DESCRIPTION}`}
          actions={
            <>
              <Button onClick={toggleTheme} variant="outline">
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                {theme === "dark" ? "Light" : "Dark"}
              </Button>
              <Button onClick={showFoundationToast}>
                <CheckCircle2 className="h-4 w-4" />
                Check
              </Button>
            </>
          }
        />

        <section className="mt-6 grid gap-4 md:grid-cols-3">
          {foundationStats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <SectionCard
            title="Foundation Scope"
            description="Core pieces now available for feature phases."
          >
            <div className="space-y-3">
              {completedItems.map((item) => (
                <div
                  className="flex items-start gap-3 rounded-md border border-slate-200 p-3 dark:border-slate-800"
                  key={item}
                >
                  <CheckCircle2
                    className="mt-0.5 h-4 w-4 shrink-0 text-success"
                    aria-hidden="true"
                  />
                  <span className="text-sm text-slate-700 dark:text-slate-300">{item}</span>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard
            title="Ready States"
            description="Reusable empty, loading, and action states."
          >
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="brand">Tailwind v4</Badge>
                <Badge variant="success">Type safe</Badge>
                <Badge variant="warning">API ready</Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <Spinner />
                Loading action state
              </div>
              <LoadingSkeleton lines={3} />
              <TableSkeleton rows={3} />
            </div>
          </SectionCard>
        </section>

        <SectionCard className="mt-6" title="Placeholder Route">
          <EmptyState
            title="No business page mounted yet"
            description="Phase 1 intentionally stops at the application foundation. Authentication and the protected layout can now be built on top of this shell."
          />
        </SectionCard>
      </main>
    </div>
  );
}
