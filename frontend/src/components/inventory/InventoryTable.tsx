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
import type { InventoryItem } from "@/types/inventory";

interface InventoryTableProps {
  items: InventoryItem[];
  isLoading?: boolean;
  onAdjustStock?: (item: InventoryItem) => void;
  onViewMovements?: (item: InventoryItem) => void;
}

export function InventoryTable({
  items,
  isLoading,
  onAdjustStock,
  onViewMovements,
}: InventoryTableProps) {
  const getStockStatus = (item: InventoryItem) => {
    if (item.quantityAvailable <= 0) {
      return { label: 'Out of Stock', variant: 'destructive' as const };
    }
    if (item.quantityAvailable <= item.reorderPoint) {
      return { label: 'Low Stock', variant: 'warning' as const };
    }
    return { label: 'In Stock', variant: 'success' as const };
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="h-10 bg-muted animate-pulse rounded" />
        <div className="h-10 bg-muted animate-pulse rounded" />
        <div className="h-10 bg-muted animate-pulse rounded" />
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No inventory items found
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead className="text-right">On Hand</TableHead>
            <TableHead className="text-right">Reserved</TableHead>
            <TableHead className="text-right">Available</TableHead>
            <TableHead className="text-right">Reorder Point</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => {
            const status = getStockStatus(item);
            return (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.productName}</TableCell>
                <TableCell>{item.productSku}</TableCell>
                <TableCell className="text-right">{item.quantityOnHand}</TableCell>
                <TableCell className="text-right">{item.quantityReserved}</TableCell>
                <TableCell className="text-right font-medium">
                  {item.quantityAvailable}
                </TableCell>
                <TableCell className="text-right">{item.reorderPoint}</TableCell>
                <TableCell>
                  <Badge variant={status.variant}>{status.label}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {onAdjustStock && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onAdjustStock(item)}
                      >
                        Adjust
                      </Button>
                    )}
                    {onViewMovements && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewMovements(item)}
                      >
                        History
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
