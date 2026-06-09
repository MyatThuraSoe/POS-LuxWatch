import { useParams, useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/common/PageHeader";
import { ReceivingForm } from "@/components/purchases";
import { Button } from "@/components/ui/button";
import { usePurchaseOrder, useReceivePO } from "@/hooks/usePurchaseOrders";
import { toast } from "sonner";
import type { ReceiveOrderData } from "@/types/purchaseOrder";

export function ReceivePOPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const poId = id ? parseInt(id) : 0;
  
  const { data: po, isLoading } = usePurchaseOrder(poId);
  const receiveMutation = useReceivePO();

  const handleSubmit = (data: ReceiveOrderData) => {
    receiveMutation.mutate({ id: poId, data }, {
      onSuccess: () => {
        toast.success("Purchase order received successfully");
        navigate(`/purchase-orders/${poId}`);
      },
      onError: () => {
        toast.error("Failed to receive purchase order");
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Loading purchase order details...</p>
      </div>
    );
  }

  if (!po) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Purchase order not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Receive Goods - ${po.orderNumber}`}
        description={`Supplier: ${po.supplierName}`}
      >
        <Button variant="outline" onClick={() => navigate(`/purchase-orders/${poId}`)}>
          Back to PO Details
        </Button>
      </PageHeader>

      <ReceivingForm
        purchaseOrder={po}
        onSubmit={handleSubmit}
        isLoading={receiveMutation.isPending}
      />
    </div>
  );
}
