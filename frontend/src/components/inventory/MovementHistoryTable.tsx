import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { InventoryMovement } from "@/types/inventory";

interface MovementHistoryTableProps {
  movements: InventoryMovement[];
  isLoading?: boolean;
}

const movementTypeColors: Record<InventoryMovement['movementType'], string> = {
  in: 'bg-green-100 text-green-800',
  out: 'bg-red-100 text-red-800',
  adjustment: 'bg-blue-100 text-blue-800',
  sale: 'bg-orange-100 text-orange-800',
  return: 'bg-purple-100 text-purple-800',
  purchase: 'bg-emerald-100 text-emerald-800',
};

export function MovementHistoryTable({ movements, isLoading }: MovementHistoryTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="h-10 bg-muted animate-pulse rounded" />
        <div className="h-10 bg-muted animate-pulse rounded" />
        <div className="h-10 bg-muted animate-pulse rounded" />
      </div>
    );
  }

  if (!movements || movements.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No movement history found
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-right">Quantity</TableHead>
            <TableHead className="text-right">Before</TableHead>
            <TableHead className="text-right">After</TableHead>
            <TableHead>Reason</TableHead>
            <TableHead>Performed By</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {movements.map((movement) => (
            <TableRow key={movement.id}>
              <TableCell>
                {new Date(movement.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell className="font-medium">{movement.productName}</TableCell>
              <TableCell>
                <Badge className={movementTypeColors[movement.movementType]}>
                  {movement.movementType}
                </Badge>
              </TableCell>
              <TableCell className={`text-right font-medium ${
                movement.quantity > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {movement.quantity > 0 ? '+' : ''}{movement.quantity}
              </TableCell>
              <TableCell className="text-right">{movement.quantityBefore}</TableCell>
              <TableCell className="text-right">{movement.quantityAfter}</TableCell>
              <TableCell className="max-w-[200px] truncate">
                {movement.reason || '-'}
              </TableCell>
              <TableCell>{movement.performedByName}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
