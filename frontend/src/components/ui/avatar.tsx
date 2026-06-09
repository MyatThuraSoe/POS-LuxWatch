import type { HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

type AvatarProps = HTMLAttributes<HTMLDivElement> & {
  name: string;
  imageUrl?: string;
};

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function Avatar({ className, name, imageUrl, ...props }: AvatarProps) {
  return (
    <div
      className={cn(
        "flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-200 text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200",
        className,
      )}
      aria-label={name}
      {...props}
    >
      {imageUrl ? (
        <img className="h-full w-full object-cover" src={imageUrl} alt="" />
      ) : (
        getInitials(name)
      )}
    </div>
  );
}
