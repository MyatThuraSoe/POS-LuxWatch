import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { InventoryTable, AlertsPanel, AdjustmentModal } from "@/components/inventory";
import { useInventory, useStockAdjustment, useInventoryAlerts } from "@/hooks/useInventory";
import type { InventoryItem } from "@/types/inventory";
import { toast } from "sonner";

export function InventoryPage() {
  const [adjustmentItem, setAdjustmentItem] = useState<InventoryItem | null>(null);
  const [isAdjustmentOpen, setIsAdjustmentOpen] = useState(false);

  const { data: inventoryData, isLoading } = useInventory();
  const { data: alerts } = useInventoryAlerts();
  const adjustMutation = useStockAdjustment();

  const handleAdjustStock = (item: InventoryItem) => {
    setAdjustmentItem(item);
    setIsAdjustmentOpen(true);
  };

  const handleSubmitAdjustment = (data: { productId: number; quantity: string; adjustmentType: "add" | "remove"; reason: string; notes?: string }) => {
    adjustMutation.mutate(
      {
        productId: data.productId,
        quantity: parseInt(data.quantity),
        adjustmentType: data.adjustmentType,
        reason: data.reason,
        notes: data.notes,
      },
      {
        onSuccess: () => {
          toast.success("Stock adjusted successfully");
          setIsAdjustmentOpen(false);
          setAdjustmentItem(null);
        },
        onError: () => {
          toast.error("Failed to adjust stock");
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inventory Management"
        description="View and manage stock levels across all products"
      />

      <AlertsPanel alerts={alerts || []} />

      <InventoryTable
        items={inventoryData?.data || []}
        isLoading={isLoading}
        onAdjustStock={handleAdjustStock}
      />

      <AdjustmentModal
        open={isAdjustmentOpen}
        onOpenChange={setIsAdjustmentOpen}
        item={adjustmentItem}
        onSubmit={handleSubmitAdjustment}
        isLoading={adjustMutation.isPending}
      />
    </div>
  );
}
