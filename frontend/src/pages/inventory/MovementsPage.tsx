import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { MovementHistoryTable } from "@/components/inventory";
import { useMovementHistory } from "@/hooks/useInventory";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function MovementsPage() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<Record<string, unknown>>({});
  
  const { data: movements, isLoading } = useMovementHistory(filters);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inventory Movement History"
        description="View all inventory transactions and movements"
      >
        <Button variant="outline" onClick={() => navigate("/inventory")}>
          Back to Inventory
        </Button>
      </PageHeader>

      <MovementHistoryTable
        movements={movements || []}
        isLoading={isLoading}
      />
    </div>
  );
}
