import { useParams, useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { usePurchaseOrder, useCancelPO, useApprovePO } from "@/hooks/usePurchaseOrders";
import { PURCHASE_ORDER_STATUS_COLORS } from "@/types/purchaseOrder";
import { toast } from "sonner";

export function PODetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const poId = id ? parseInt(id) : 0;
  
  const { data: po, isLoading } = usePurchaseOrder(poId);
  const cancelMutation = useCancelPO();
  const approveMutation = useApprovePO();

  const handleCancel = () => {
    if (confirm("Are you sure you want to cancel this purchase order?")) {
      cancelMutation.mutate(poId, {
        onSuccess: () => {
          toast.success("Purchase order cancelled");
        },
        onError: () => {
          toast.error("Failed to cancel purchase order");
        },
      });
    }
  };

  const handleApprove = () => {
    if (confirm("Approve this purchase order?")) {
      approveMutation.mutate(poId, {
        onSuccess: () => {
          toast.success("Purchase order approved");
        },
        onError: () => {
          toast.error("Failed to approve purchase order");
        },
      });
    }
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
        title={`Purchase Order ${po.orderNumber}`}
        description="Purchase order details"
      >
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate("/purchase-orders")}>
            Back to List
          </Button>
          {po.status === "draft" && (
            <>
              <Button onClick={() => navigate(`/purchase-orders/${poId}/edit`)}>
                Edit
              </Button>
              <Button onClick={handleApprove} variant="default">
                Approve
              </Button>
              <Button variant="danger" onClick={handleCancel}>
                Cancel
              </Button>
            </>
          )}
          {po.status === "approved" && (
            <Button onClick={() => navigate(`/purchase-orders/${poId}/receive`)}>
              Receive Goods
            </Button>
          )}
        </div>
      </PageHeader>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Order Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Order Number</p>
              <p className="font-medium">{po.orderNumber}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge className={PURCHASE_ORDER_STATUS_COLORS[po.status]}>
                {po.status.replace("_", " ")}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Order Date</p>
              <p className="font-medium">{new Date(po.orderDate).toLocaleDateString()}</p>
            </div>
            {po.expectedDeliveryDate && (
              <div>
                <p className="text-sm text-muted-foreground">Expected Delivery</p>
                <p className="font-medium">{new Date(po.expectedDeliveryDate).toLocaleDateString()}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Supplier</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium">{po.supplierName}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Financial Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Subtotal:</span>
              <span className="font-medium">${po.subtotal.toFixed(2)}</span>
            </div>
            {po.taxAmount > 0 && (
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Tax:</span>
                <span className="font-medium">${po.taxAmount.toFixed(2)}</span>
              </div>
            )}
            {po.discountAmount > 0 && (
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Discount:</span>
                <span className="font-medium">-${po.discountAmount.toFixed(2)}</span>
              </div>
            )}
            {po.shippingCost > 0 && (
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Shipping:</span>
                <span className="font-medium">${po.shippingCost.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between border-t pt-2">
              <span className="font-semibold">Total:</span>
              <span className="font-bold text-lg">${po.totalAmount.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Product</th>
                  <th className="text-right py-2">Ordered</th>
                  <th className="text-right py-2">Received</th>
                  <th className="text-right py-2">Pending</th>
                  <th className="text-right py-2">Unit Price</th>
                  <th className="text-right py-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {po.items.map((item) => (
                  <tr key={item.productId} className="border-b">
                    <td className="py-3">
                      <p className="font-medium">{item.productName}</p>
                      {item.productSku && <p className="text-sm text-muted-foreground">{item.productSku}</p>}
                    </td>
                    <td className="text-right py-3">{item.quantityOrdered}</td>
                    <td className="text-right py-3">{item.quantityReceived}</td>
                    <td className="text-right py-3">{item.quantityPending}</td>
                    <td className="text-right py-3">${item.unitPrice.toFixed(2)}</td>
                    <td className="text-right py-3 font-medium">${item.totalPrice.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {(po.notes || po.internalNotes) && (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {po.notes && (
              <div>
                <p className="text-sm font-medium mb-1">Notes to Supplier:</p>
                <p className="text-muted-foreground">{po.notes}</p>
              </div>
            )}
            {po.internalNotes && (
              <div>
                <p className="text-sm font-medium mb-1">Internal Notes:</p>
                <p className="text-muted-foreground">{po.internalNotes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
