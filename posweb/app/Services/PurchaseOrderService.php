<?php

namespace App\Services;

use App\Models\PurchaseOrder;
use App\Models\PurchaseOrderItem;
use App\Models\GoodsReceipt;
use App\Models\GoodsReceiptItem;
use Illuminate\Support\Facades\DB;

class PurchaseOrderService extends BaseService
{
    public function getAll(array $filters = [])
    {
        $query = PurchaseOrder::query()->with(['supplier', 'createdBy', 'approvedBy']);

        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (isset($filters['supplier_id'])) {
            $query->where('supplier_id', $filters['supplier_id']);
        }

        return $query->withCount(['items', 'receipts'])->orderBy('created_at', 'desc')->paginate(15);
    }

    public function findById(int $id): PurchaseOrder
    {
        return PurchaseOrder::with(['supplier', 'items.variant', 'receipts.items'])->findOrFail($id);
    }

    public function create(array $data): PurchaseOrder
    {
        return DB::transaction(function () use ($data) {
            $items = $data['items'] ?? [];
            unset($data['items']);

            $data['po_number'] = 'PO-' . date('Ymd') . '-' . str_pad(PurchaseOrder::whereDate('created_at', today())->count() + 1, 4, '0', STR_PAD_LEFT);
            $data['created_by'] = auth()->id();

            $order = PurchaseOrder::create($data);

            foreach ($items as $itemData) {
                $itemData['purchase_order_id'] = $order->id;
                $itemData['line_total'] = $itemData['quantity_ordered'] * $itemData['unit_cost'];
                PurchaseOrderItem::create($itemData);
            }

            $order->total_amount = $order->items()->sum('line_total');
            $order->save();

            $this->audit('created', $order, 'purchase_order');
            return $order;
        });
    }

    public function update(int $id, array $data): PurchaseOrder
    {
        return DB::transaction(function () use ($id, $data) {
            $order = PurchaseOrder::findOrFail($id);
            
            if (!in_array($order->status, ['draft', 'pending'])) {
                throw new \Exception('Cannot update order that is not in draft or pending status');
            }

            $order->update($data);
            $this->audit('updated', $order, 'purchase_order');
            return $order->fresh();
        });
    }

    public function approve(int $id, int $userId): PurchaseOrder
    {
        return DB::transaction(function () use ($id, $userId) {
            $order = PurchaseOrder::findOrFail($id);
            
            if ($order->status !== 'pending') {
                throw new \Exception('Only pending orders can be approved');
            }

            $order->status = 'approved';
            $order->approved_by = $userId;
            $order->save();

            $this->audit('approved', $order, 'purchase_order');
            return $order;
        });
    }

    public function receiveGoods(int $orderId, array $data, int $userId): array
    {
        return DB::transaction(function () use ($orderId, $data, $userId) {
            $order = PurchaseOrder::findOrFail($orderId);
            
            if (!in_array($order->status, ['approved', 'partially_received'])) {
                throw new \Exception('Can only receive goods for approved or partially received orders');
            }

            // Create goods receipt
            $receipt = GoodsReceipt::create([
                'purchase_order_id' => $orderId,
                'receipt_number' => 'GR-' . date('Ymd') . '-' . str_pad(GoodsReceipt::whereDate('created_at', today())->count() + 1, 4, '0', STR_PAD_LEFT),
                'received_by' => $userId,
                'notes' => $data['notes'] ?? null,
            ]);

            $inventoryService = app(\App\Services\InventoryService::class);
            $totalReceived = 0;

            foreach ($data['items'] as $itemData) {
                $poItem = PurchaseOrderItem::findOrFail($itemData['po_item_id']);
                
                // Create receipt item
                GoodsReceiptItem::create([
                    'goods_receipt_id' => $receipt->id,
                    'po_item_id' => $poItem->id,
                    'quantity_received' => $itemData['quantity_received'],
                    'serial_numbers' => $itemData['serial_numbers'],
                    'condition' => $itemData['condition'],
                ]);

                // Update PO item received quantity
                $poItem->quantity_received += $itemData['quantity_received'];
                $poItem->save();

                // Register serials and update inventory for good condition items
                if ($itemData['condition'] === 'good') {
                    foreach ($itemData['serial_numbers'] as $serialCode) {
                        $inventoryService->registerSerial($poItem->variant_id, $serialCode);
                    }
                    
                    $inventoryService->adjustStock(
                        $poItem->variant_id,
                        $itemData['quantity_received'],
                        "Received from PO {$order->po_number}",
                        $itemData['serial_numbers'],
                        $userId
                    );
                }

                $totalReceived += $itemData['quantity_received'];
            }

            // Update PO status
            $totalOrdered = $order->items()->sum('quantity_ordered');
            $totalReceivedAll = $order->items()->sum('quantity_received');
            
            if ($totalReceivedAll >= $totalOrdered) {
                $order->status = 'completed';
            } else {
                $order->status = 'partially_received';
            }
            $order->save();

            $this->audit('received_goods', $order, 'purchase_order', ['receipt_id' => $receipt->id]);
            
            return [
                'receipt_id' => $receipt->id,
                'po_status' => $order->status,
                'inventory_updated' => true,
                'cost_recalculated' => true,
            ];
        });
    }

    public function cancel(int $id, int $userId): PurchaseOrder
    {
        return DB::transaction(function () use ($id, $userId) {
            $order = PurchaseOrder::findOrFail($id);
            
            if (!in_array($order->status, ['draft', 'pending', 'approved'])) {
                throw new \Exception('Cannot cancel order that is already completed or cancelled');
            }

            $order->status = 'cancelled';
            $order->save();

            $this->audit('cancelled', $order, 'purchase_order');
            return $order;
        });
    }

    public function generatePdf(int $id): string
    {
        $order = $this->findById($id);
        // In production, generate actual PDF
        return "/api/v1/purchases/{$id}/pdf-download";
    }
}
