import type { ReactNode } from "react";

type SidebarSectionProps = {
  title: string;
  children: ReactNode;
};

export function SidebarSection({ title, children }: SidebarSectionProps) {
  return (
    <section className="space-y-2">
      <h2 className="px-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
        {title}
      </h2>
      <div className="space-y-1">{children}</div>
    </section>
  );
}
