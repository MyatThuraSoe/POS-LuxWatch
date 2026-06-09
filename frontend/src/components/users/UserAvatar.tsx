import type { User } from "../../types/user";
import { cn } from "../../lib/utils";

type UserAvatarProps = {
  user?: User | null;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
};

const sizeClasses = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-16 w-16 text-lg",
};

export function UserAvatar({ user, size = "md", className }: UserAvatarProps) {
  const initials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "?";

  const bgColor = user?.id ? `hsl(${(user.id * 37) % 360}, 70%, 85%)` : "hsl(0, 0%, 80%)";
  const textColor = user?.id ? `hsl(${(user.id * 37) % 360}, 70%, 30%)` : "hsl(0, 0%, 40%)";

  if (user?.avatarUrl) {
    return (
      <img
        src={user.avatarUrl}
        alt={user.name || "User avatar"}
        className={cn("rounded-full object-cover", sizeClasses[size], className)}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full font-semibold",
        sizeClasses[size],
        className,
      )}
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      {initials}
    </div>
  );
}
