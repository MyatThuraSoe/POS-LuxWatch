<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PurchaseOrderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'po_number' => $this->po_number,
            'supplier' => new SupplierResource($this->whenLoaded('supplier')),
            'status' => $this->status,
            'order_date' => $this->order_date?->toIso8601String(),
            'expected_delivery_date' => $this->expected_delivery_date?->toIso8601String(),
            'total_amount' => $this->total_amount,
            'tax_amount' => $this->tax_amount,
            'discount_amount' => $this->discount_amount,
            'notes' => $this->notes,
            'items_count' => $this->whenCounted('items'),
            'receipts_count' => $this->whenCounted('receipts'),
            'created_by_name' => $this->whenLoaded('createdBy', fn() => $this->createdBy->name),
            'approved_by_name' => $this->whenLoaded('approvedBy', fn() => $this->approvedBy?->name),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
