import { LoaderCircle } from "lucide-react";
import { cn } from "../../lib/utils";

type SpinnerProps = {
  className?: string;
  label?: string;
  size?: "sm" | "md" | "lg";
};

export function Spinner({ className, label = "Loading", size = "md" }: SpinnerProps) {
  const sizeClass = size === "sm" ? "h-3 w-3" : size === "lg" ? "h-6 w-6" : "h-4 w-4";

  return (
    <LoaderCircle
      className={cn(`${sizeClass} animate-spin text-current`, className)}
      role="status"
      aria-label={label}
    />
  );
}
