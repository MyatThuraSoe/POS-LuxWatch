import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { PurchaseOrder } from "@/types/purchaseOrder";
import { PURCHASE_ORDER_STATUS_COLORS } from "@/types/purchaseOrder";

interface PurchaseOrderTableProps {
  orders: PurchaseOrder[];
  isLoading?: boolean;
  onView?: (order: PurchaseOrder) => void;
  onEdit?: (order: PurchaseOrder) => void;
  onApprove?: (order: PurchaseOrder) => void;
  onReceive?: (order: PurchaseOrder) => void;
}

export function PurchaseOrderTable({
  orders,
  isLoading,
  onView,
  onEdit,
  onApprove,
  onReceive,
}: PurchaseOrderTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="h-10 bg-muted animate-pulse rounded" />
        <div className="h-10 bg-muted animate-pulse rounded" />
        <div className="h-10 bg-muted animate-pulse rounded" />
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No purchase orders found
      </div>
    );
  }

  const getStatusLabel = (status: PurchaseOrder['status']) => {
    const labels: Record<PurchaseOrder['status'], string> = {
      draft: 'Draft',
      pending: 'Pending',
      approved: 'Approved',
      partially_received: 'Partial',
      received: 'Received',
      cancelled: 'Cancelled',
    };
    return labels[status];
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order #</TableHead>
            <TableHead>Supplier</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">{order.orderNumber}</TableCell>
              <TableCell>{order.supplierName}</TableCell>
              <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
              <TableCell>
                <Badge className={PURCHASE_ORDER_STATUS_COLORS[order.status]}>
                  {getStatusLabel(order.status)}
                </Badge>
              </TableCell>
              <TableCell className="text-right font-medium">
                ${order.totalAmount.toFixed(2)}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  {onView && (
                    <Button variant="ghost" size="sm" onClick={() => onView(order)}>
                      View
                    </Button>
                  )}
                  {onEdit && order.status === 'draft' && (
                    <Button variant="outline" size="sm" onClick={() => onEdit(order)}>
                      Edit
                    </Button>
                  )}
                  {onApprove && order.status === 'pending' && (
                    <Button variant="default" size="sm" onClick={() => onApprove(order)}>
                      Approve
                    </Button>
                  )}
                  {onReceive && (order.status === 'approved' || order.status === 'partially_received') && (
                    <Button variant="default" size="sm" onClick={() => onReceive(order)}>
                      Receive
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
