import { useLocation } from "react-router-dom";
import { EmptyState, PageHeader, SectionCard } from "../components/common";

const labels: Record<string, string> = {
  "/pos": "POS",
  "/inventory": "Inventory",
  "/customers": "Customers",
  "/repairs": "Repairs",
  "/reports": "Reports",
  "/receipts": "Receipts",
  "/settings": "Settings",
};

export function ModulePlaceholderPage() {
  const location = useLocation();
  const title = labels[location.pathname] ?? "Module";

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Protected module"
        title={title}
        description="This route is reserved for the next feature phases."
      />
      <SectionCard>
        <EmptyState
          title={`${title} is not implemented yet`}
          description="The authenticated route and layout are ready; module-specific API work will be added in its phase."
        />
      </SectionCard>
    </div>
  );
}
