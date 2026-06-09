import { cn } from "../../lib/utils";

type LoadingSkeletonProps = {
  className?: string;
  lines?: number;
};

export function LoadingSkeleton({ className, lines = 1 }: LoadingSkeletonProps) {
  if (lines > 1) {
    return (
      <div className={cn("space-y-2", className)} aria-label="Loading">
        {Array.from({ length: lines }).map((_, index) => (
          <div
            className={cn(
              "h-3 animate-pulse rounded bg-slate-200 dark:bg-slate-800",
              index === lines - 1 && "w-2/3",
            )}
            key={index}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn("h-4 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-800", className)}
      aria-label="Loading"
    />
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3" aria-label="Loading table">
      {Array.from({ length: rows }).map((_, index) => (
        <div className="grid grid-cols-4 gap-3" key={index}>
          <LoadingSkeleton />
          <LoadingSkeleton />
          <LoadingSkeleton />
          <LoadingSkeleton className="w-2/3" />
        </div>
      ))}
    </div>
  );
}
