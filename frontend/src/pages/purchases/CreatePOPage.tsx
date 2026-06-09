import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/common/PageHeader";
import { PurchaseOrderForm } from "@/components/purchases";
import { Button } from "@/components/ui/button";
import { useCreatePO, useSuppliers } from "@/hooks/usePurchaseOrders";
import { toast } from "sonner";
import type { PurchaseOrderFormData } from "@/types/purchaseOrder";

export function CreatePOPage() {
  const navigate = useNavigate();
  const createMutation = useCreatePO();
  const { data: suppliersData } = useSuppliers({});

  const handleSubmit = (data: PurchaseOrderFormData) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        toast.success("Purchase order created successfully");
        navigate("/purchase-orders");
      },
      onError: () => {
        toast.error("Failed to create purchase order");
      },
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Purchase Order"
        description="Create a new purchase order for supplier"
      >
        <Button variant="outline" onClick={() => navigate("/purchase-orders")}>
          Back to List
        </Button>
      </PageHeader>

      <PurchaseOrderForm
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending}
        suppliers={suppliersData?.data || []}
        initialData={undefined}
      />
    </div>
  );
}
