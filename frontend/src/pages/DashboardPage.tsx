import { AlertTriangle, CircleDollarSign, PackageSearch, ShoppingCart, TrendingUp, Users } from "lucide-react";
import { PageHeader, SectionCard } from "../components/common";
import { Badge } from "../components/ui";
import { KPICard, SalesChart, ActivityFeed, AlertsWidget } from "../components/ui";
import { useDashboardData, useDailySales, useTodaySummary, useInventoryAlerts, useActivityFeed } from "../hooks/useDashboard";
import { formatCurrency } from "../lib/utils";
import { useAuthStore } from "../stores/authStore";

export function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  
  const { data: kpis, isLoading: kpisLoading } = useDashboardData();
  const { data: salesData, isLoading: salesLoading } = useDailySales();
  const { data: todaySummary, isLoading: todayLoading } = useTodaySummary();
  const { data: alerts, isLoading: alertsLoading } = useInventoryAlerts();
  const { data: activities, isLoading: activityLoading } = useActivityFeed();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Dashboard"
        title={`Welcome${user?.name ? `, ${user.name}` : ""}`}
        description="Overview of your business performance and key metrics"
        actions={<Badge variant="success">Live Data</Badge>}
      />

      {/* KPI Cards */}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KPICard
          label="Today's Revenue"
          value={todayLoading ? "..." : formatCurrency(todaySummary?.total_revenue || 0)}
          detail={`${todaySummary?.sales_count || 0} transactions`}
          icon={<CircleDollarSign className="h-5 w-5" />}
          loading={todayLoading}
        />
        <KPICard
          label="Total Revenue"
          value={kpisLoading ? "..." : formatCurrency(kpis?.total_revenue || 0)}
          trend={kpis?.profit_margin ? { value: kpis.profit_margin, isPositive: true } : undefined}
          detail={`Period: ${kpis?.period.start || "..."} - ${kpis?.period.end || "..."}`}
          icon={<TrendingUp className="h-5 w-5" />}
          loading={kpisLoading}
        />
        <KPICard
          label="Gross Profit"
          value={kpisLoading ? "..." : formatCurrency(kpis?.gross_profit || 0)}
          detail={`Margin: ${kpis?.profit_margin?.toFixed(1) || 0}%`}
          icon={<PackageSearch className="h-5 w-5" />}
          loading={kpisLoading}
        />
        <KPICard
          label="Low Stock Items"
          value={alertsLoading ? "..." : (alerts?.length || 0)}
          detail={alerts && alerts.length > 0 ? "Needs attention" : "All stock levels OK"}
          icon={<AlertTriangle className="h-5 w-5" />}
          loading={alertsLoading}
        />
      </section>

      {/* Charts and Widgets */}
      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <SectionCard title="Sales Overview" description="Daily revenue trends">
          <SalesChart data={salesData || []} loading={salesLoading} />
        </SectionCard>
        <SectionCard title="Low Stock Alerts" description="Items needing restock">
          <AlertsWidget alerts={alerts || []} loading={alertsLoading} />
        </SectionCard>
      </section>

      {/* Activity Feed */}
      <section className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <SectionCard title="Recent Activity" description="Latest system events">
          <ActivityFeed activities={activities || []} loading={activityLoading} />
        </SectionCard>
        <SectionCard title="Quick Stats" description="Today's summary">
          <dl className="space-y-4">
            <div className="flex items-center justify-between rounded-md border border-slate-200 p-3 dark:border-slate-800">
              <dt className="text-sm text-slate-500 dark:text-slate-400">Transactions</dt>
              <dd className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                {todayLoading ? "..." : todaySummary?.sales_count || 0}
              </dd>
            </div>
            <div className="flex items-center justify-between rounded-md border border-slate-200 p-3 dark:border-slate-800">
              <dt className="text-sm text-slate-500 dark:text-slate-400">Items Sold</dt>
              <dd className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                {todayLoading ? "..." : todaySummary?.total_items_sold || 0}
              </dd>
            </div>
            <div className="flex items-center justify-between rounded-md border border-slate-200 p-3 dark:border-slate-800">
              <dt className="text-sm text-slate-500 dark:text-slate-400">Avg Order Value</dt>
              <dd className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                {kpisLoading ? "..." : formatCurrency(kpis?.avg_order_value || 0)}
              </dd>
            </div>
          </dl>
        </SectionCard>
      </section>
    </div>
  );
}
