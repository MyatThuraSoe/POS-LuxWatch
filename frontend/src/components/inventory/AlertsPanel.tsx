import { Badge } from "@/components/ui/badge";
import type { InventoryAlert } from "@/types/inventory";

interface AlertsPanelProps {
  alerts: InventoryAlert[];
  isLoading?: boolean;
}

export function AlertsPanel({ alerts, isLoading }: AlertsPanelProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="h-16 bg-muted animate-pulse rounded" />
        <div className="h-16 bg-muted animate-pulse rounded" />
      </div>
    );
  }

  if (!alerts || alerts.length === 0) {
    return null;
  }

  const criticalAlerts = alerts.filter((a) => a.severity === 'critical' || a.severity === 'out_of_stock');
  const lowAlerts = alerts.filter((a) => a.severity === 'low');

  return (
    <div className="space-y-4">
      {criticalAlerts.length > 0 && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <h3 className="text-sm font-semibold text-red-800 mb-2">
            Critical Stock Alerts ({criticalAlerts.length})
          </h3>
          <div className="space-y-2">
            {criticalAlerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-center justify-between text-sm"
              >
                <span className="font-medium text-red-900">{alert.productName}</span>
                <Badge variant="danger">
                  {alert.severity === 'out_of_stock' ? 'Out of Stock' : 'Critical'}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {lowAlerts.length > 0 && (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
          <h3 className="text-sm font-semibold text-yellow-800 mb-2">
            Low Stock Alerts ({lowAlerts.length})
          </h3>
          <div className="space-y-2">
            {lowAlerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-center justify-between text-sm"
              >
                <span className="font-medium text-yellow-900">{alert.productName}</span>
                <Badge variant="warning">Low Stock</Badge>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
