import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { AdjustmentForm } from "@/components/inventory";
import { useInventory, useStockAdjustment } from "@/hooks/useInventory";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export function AdjustmentsPage() {
  const navigate = useNavigate();
  const [productId, setProductId] = useState<number | undefined>(undefined);
  
  const { data: inventoryData } = useInventory();
  const adjustMutation = useStockAdjustment();

  const handleSubmit = (data: { productId: number; quantity: string; adjustmentType: "add" | "remove"; reason: string; notes?: string }) => {
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
          navigate("/inventory");
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
        title="Stock Adjustment"
        description="Adjust inventory levels with reason tracking"
      >
        <Button variant="outline" onClick={() => navigate("/inventory")}>
          Back to Inventory
        </Button>
      </PageHeader>

      <AdjustmentForm
        products={inventoryData?.data || []}
        selectedProductId={productId}
        onProductChange={setProductId}
        onSubmit={handleSubmit}
        isLoading={adjustMutation.isPending}
      />
    </div>
  );
}
