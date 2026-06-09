<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InventoryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'variant_id' => $this->variant_id,
            'quantity' => $this->quantity,
            'reserved_quantity' => $this->reserved_quantity,
            'available_quantity' => $this->quantity - $this->reserved_quantity,
            'low_stock_threshold' => $this->low_stock_threshold,
            'is_low_stock' => $this->quantity <= $this->low_stock_threshold,
            'variant' => [
                'sku' => $this->when($this->relationLoaded('variant'), $this->variant?->sku),
                'product_name' => $this->when($this->relationLoaded('variant'), $this->variant?->product?->name),
            ],
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
