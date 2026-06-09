import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/common/PageHeader";
import { PurchaseOrderTable } from "@/components/purchases";
import { Button } from "@/components/ui/button";
import { usePurchaseOrders, useApprovePO } from "@/hooks/usePurchaseOrders";
import type { PurchaseOrder } from "@/types/purchaseOrder";
import { toast } from "sonner";

export function PurchaseOrderListPage() {
  const navigate = useNavigate();
  const [filters] = useState<Record<string, unknown>>({});

  const { data: ordersData, isLoading } = usePurchaseOrders(filters);
  const approveMutation = useApprovePO();

  const handleView = (order: PurchaseOrder) => {
    navigate(`/purchase-orders/${order.id}`);
  };

  const handleEdit = (order: PurchaseOrder) => {
    navigate(`/purchase-orders/${order.id}/edit`);
  };

  const handleApprove = (order: PurchaseOrder) => {
    if (confirm(`Approve purchase order ${order.orderNumber}?`)) {
      approveMutation.mutate(order.id, {
        onSuccess: () => {
          toast.success("Purchase order approved");
        },
        onError: () => {
          toast.error("Failed to approve purchase order");
        },
      });
    }
  };

  const handleReceive = (order: PurchaseOrder) => {
    navigate(`/purchase-orders/${order.id}/receive`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Purchase Orders"
        description="Manage purchase orders and receiving"
      >
        <Button onClick={() => navigate("/purchase-orders/create")}>
          Create PO
        </Button>
      </PageHeader>

      <PurchaseOrderTable
        orders={ordersData?.data || []}
        isLoading={isLoading}
        onView={handleView}
        onEdit={handleEdit}
        onApprove={handleApprove}
        onReceive={handleReceive}
      />
    </div>
  );
}
