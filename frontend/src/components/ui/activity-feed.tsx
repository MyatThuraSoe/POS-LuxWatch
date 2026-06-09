import type { ActivityItem } from "../../types/user";
import { formatDate } from "../../lib/utils";

type ActivityFeedProps = {
  activities: ActivityItem[];
  loading?: boolean;
};

export function ActivityFeed({ activities, loading = false }: ActivityFeedProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-3">
            <div className="h-8 w-8 shrink-0 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-3 w-1/4 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
        No recent activity
      </p>
    );
  }

  const getIconForType = (type: string) => {
    switch (type) {
      case "sale":
        return "💰";
      case "inventory":
        return "📦";
      case "user":
        return "👤";
      case "product":
        return "🏷️";
      default:
        return "📝";
    }
  };

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-lg dark:bg-slate-800">
            {getIconForType(activity.type)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-slate-900 dark:text-slate-50">{activity.description}</p>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                {activity.user_name}
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {formatDate(activity.created_at)}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
