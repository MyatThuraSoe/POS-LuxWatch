<?php

namespace App\Services;

use App\Models\InventoryItem;
use App\Models\SerialNumber;
use App\Models\StockMovement;
use App\Models\ProductVariant;
use App\Models\PurchaseOrderItem;
use App\Models\GoodsReceiptItem;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Collection;

class InventoryService
{
    public function getAvailableQuantity(int $variantId): int
    {
        $item = InventoryItem::where('variant_id', $variantId)->first();
        
        if (!$item) {
            return 0;
        }

        return $item->quantity - $item->reserved_quantity;
    }

    public function hasSufficientStock(int $variantId, int $quantity): bool
    {
        return $this->getAvailableQuantity($variantId) >= $quantity;
    }

    public function adjustStock(
        int $variantId,
        int $newQuantity,
        string $reason,
        ?int $userId = null,
        array $serialsAdded = [],
        array $serialsRemoved = []
    ): array {
        return DB::transaction(function () use ($variantId, $newQuantity, $reason, $userId, $serialsAdded, $serialsRemoved) {
            $item = InventoryItem::where('variant_id', $variantId)->lockForUpdate()->first();
            
            if (!$item) {
                $item = InventoryItem::create([
                    'variant_id' => $variantId,
                    'quantity' => 0,
                    'reserved_quantity' => 0,
                ]);
            }

            $previousQuantity = $item->quantity;
            $delta = $newQuantity - $previousQuantity;

            // Register new serials if adding stock
            foreach ($serialsAdded as $serialCode) {
                SerialNumber::create([
                    'variant_id' => $variantId,
                    'serial_code' => $serialCode,
                    'status' => 'in_stock',
                ]);
            }

            // Update quantity
            $item->update(['quantity' => $newQuantity]);

            // Create movement record
            $movement = StockMovement::create([
                'variant_id' => $variantId,
                'type' => 'adjustment',
                'quantity_change' => $delta,
                'reason' => $reason,
                'performed_by' => $userId,
                'reference_type' => null,
                'reference_id' => null,
            ]);

            return [
                'variant_id' => $variantId,
                'previous_quantity' => $previousQuantity,
                'new_quantity' => $newQuantity,
                'movement_id' => $movement->id,
            ];
        });
    }

    public function deductStock(int $variantId, int $quantity, ?int $saleId = null, ?int $userId = null): void
    {
        DB::transaction(function () use ($variantId, $quantity, $saleId, $userId) {
            $item = InventoryItem::where('variant_id', $variantId)->lockForUpdate()->firstOrFail();

            if ($item->quantity - $item->reserved_quantity < $quantity) {
                throw new \Exception("Insufficient stock for variant {$variantId}");
            }

            // Reduce reserved quantity first if items were reserved
            if ($item->reserved_quantity >= $quantity) {
                $item->decrement('reserved_quantity', $quantity);
            }
            
            $item->decrement('quantity', $quantity);

            StockMovement::create([
                'variant_id' => $variantId,
                'type' => 'sale',
                'quantity_change' => -$quantity,
                'reference_type' => $saleId ? 'App\Models\Sale' : null,
                'reference_id' => $saleId,
                'reason' => 'Sale transaction',
                'performed_by' => $userId,
            ]);
        });
    }

    public function restoreStock(int $variantId, int $quantity, ?int $refundId = null, ?int $userId = null): void
    {
        DB::transaction(function () use ($variantId, $quantity, $refundId, $userId) {
            $item = InventoryItem::where('variant_id', $variantId)->lockForUpdate()->first();

            if (!$item) {
                $item = InventoryItem::create([
                    'variant_id' => $variantId,
                    'quantity' => 0,
                    'reserved_quantity' => 0,
                ]);
            }

            $item->increment('quantity', $quantity);

            StockMovement::create([
                'variant_id' => $variantId,
                'type' => 'return',
                'quantity_change' => $quantity,
                'reference_type' => $refundId ? 'App\Models\Refund' : null,
                'reference_id' => $refundId,
                'reason' => 'Refund/Return',
                'performed_by' => $userId,
            ]);
        });
    }

    public function reserveStock(int $variantId, int $quantity): bool
    {
        return DB::transaction(function () use ($variantId, $quantity) {
            $item = InventoryItem::where('variant_id', $variantId)->lockForUpdate()->first();

            if (!$item || ($item->quantity - $item->reserved_quantity) < $quantity) {
                return false;
            }

            $item->increment('reserved_quantity', $quantity);
            return true;
        });
    }

    public function releaseReservation(int $variantId, int $quantity): void
    {
        DB::transaction(function () use ($variantId, $quantity) {
            $item = InventoryItem::where('variant_id', $variantId)->lockForUpdate()->first();

            if ($item && $item->reserved_quantity >= $quantity) {
                $item->decrement('reserved_quantity', $quantity);
            }
        });
    }

    public function registerSerial(string $serialCode, int $variantId, string $status = 'in_stock'): SerialNumber
    {
        if (SerialNumber::where('serial_code', $serialCode)->exists()) {
            throw new \Exception("Serial number {$serialCode} already exists");
        }

        return SerialNumber::create([
            'variant_id' => $variantId,
            'serial_code' => $serialCode,
            'status' => $status,
        ]);
    }

    public function markSerialAsSold(int $serialId, int $saleId): void
    {
        $serial = SerialNumber::findOrFail($serialId);
        $serial->update([
            'status' => 'sold',
            'sale_id' => $saleId,
        ]);
    }

    public function markSerialAsReturned(int $serialId): void
    {
        $serial = SerialNumber::findOrFail($serialId);
        $serial->update([
            'status' => 'returned',
            'sale_id' => null,
        ]);
    }

    public function receivePurchaseOrderItems(
        int $purchaseOrderId,
        array $itemsData,
        ?int $userId = null
    ): array {
        return DB::transaction(function () use ($purchaseOrderId, $itemsData, $userId) {
            $results = [];

            foreach ($itemsData as $itemData) {
                $poItemId = $itemData['po_item_id'];
                $quantityReceived = $itemData['quantity_received'];
                $serialNumbers = $itemData['serial_numbers'] ?? [];
                $condition = $itemData['condition'] ?? 'good';

                $poItem = PurchaseOrderItem::where('id', $poItemId)
                    ->where('purchase_order_id', $purchaseOrderId)
                    ->lockForUpdate()
                    ->firstOrFail();

                if (!$poItem->canReceiveMore()) {
                    throw new \Exception("Item already fully received");
                }

                if ($quantityReceived > $poItem->quantity_remaining) {
                    throw new \Exception("Received quantity exceeds ordered quantity");
                }

                // Update PO item
                $poItem->increment('quantity_received', $quantityReceived);

                // Update or create inventory
                $inventoryItem = InventoryItem::where('variant_id', $poItem->variant_id)->first();
                
                if (!$inventoryItem) {
                    $inventoryItem = InventoryItem::create([
                        'variant_id' => $poItem->variant_id,
                        'quantity' => 0,
                        'reserved_quantity' => 0,
                    ]);
                }

                // Only add to stock if condition is good
                if ($condition === 'good') {
                    $inventoryItem->increment('quantity', $quantityReceived);
                }

                // Register serial numbers
                foreach ($serialNumbers as $serialCode) {
                    $status = $condition === 'good' ? 'in_stock' : 'defective';
                    SerialNumber::create([
                        'variant_id' => $poItem->variant_id,
                        'serial_code' => $serialCode,
                        'status' => $status,
                    ]);
                }

                // Recalculate cost price (weighted average)
                $this->recalculateCostPrice($poItem->variant_id, $poItem->unit_cost, $quantityReceived);

                // Create stock movement
                StockMovement::create([
                    'variant_id' => $poItem->variant_id,
                    'type' => 'purchase',
                    'quantity_change' => $condition === 'good' ? $quantityReceived : 0,
                    'reference_type' => 'App\Models\PurchaseOrder',
                    'reference_id' => $purchaseOrderId,
                    'reason' => "PO Receipt - {$condition}",
                    'performed_by' => $userId,
                ]);

                $results[] = [
                    'po_item_id' => $poItemId,
                    'quantity_received' => $quantityReceived,
                    'condition' => $condition,
                ];
            }

            // Update PO status
            $this->updatePurchaseOrderStatus($purchaseOrderId);

            return $results;
        });
    }

    private function recalculateCostPrice(int $variantId, float $newCost, int $newQty): void
    {
        $variant = ProductVariant::with('product')->find($variantId);
        if (!$variant) return;

        $inventoryItem = InventoryItem::where('variant_id', $variantId)->first();
        $currentQty = $inventoryItem ? $inventoryItem->quantity : 0;
        $currentCost = (float) $variant->product->cost_price;

        if ($currentQty > 0) {
            $newAverageCost = (($currentQty * $currentCost) + ($newQty * $newCost)) / ($currentQty + $newQty);
            $variant->product->update(['cost_price' => round($newAverageCost, 2)]);
        } else {
            $variant->product->update(['cost_price' => $newCost]);
        }
    }

    private function updatePurchaseOrderStatus(int $purchaseOrderId): void
    {
        $po = \App\Models\PurchaseOrder::with('items')->find($purchaseOrderId);
        if (!$po) return;

        $totalOrdered = $po->items->sum('quantity_ordered');
        $totalReceived = $po->items->sum('quantity_received');

        if ($totalReceived >= $totalOrdered) {
            $po->update(['status' => \App\Models\PurchaseOrder::STATUS_COMPLETED]);
        } elseif ($totalReceived > 0) {
            $po->update(['status' => \App\Models\PurchaseOrder::STATUS_PARTIALLY_RECEIVED]);
        }
    }

    public function getLowStockItems(): Collection
    {
        return InventoryItem::with(['variant.product'])
            ->lowStock()
            ->get();
    }
}
