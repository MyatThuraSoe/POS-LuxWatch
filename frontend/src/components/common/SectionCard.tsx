import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/utils";

type SectionCardProps = HTMLAttributes<HTMLElement> & {
  title?: string;
  description?: string;
  actions?: ReactNode;
};

export function SectionCard({
  className,
  title,
  description,
  actions,
  children,
  ...props
}: SectionCardProps) {
  return (
    <section className={cn("surface-panel rounded-md p-5", className)} {...props}>
      {(title || description || actions) && (
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            {title ? (
              <h2 className="text-base font-semibold text-slate-950 dark:text-slate-50">{title}</h2>
            ) : null}
            {description ? (
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{description}</p>
            ) : null}
          </div>
          {actions ? <div className="flex shrink-0 gap-2">{actions}</div> : null}
        </div>
      )}
      {children}
    </section>
  );
}
