<?php

namespace App\Http\Resources\Customer;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WarrantyResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'sale_id' => $this->sale_id,
            'sale_number' => $this->whenLoaded('sale', fn() => $this->sale->sale_number),
            'serial_code' => $this->whenLoaded('serial', fn() => $this->serial->serial_code),
            'product_name' => $this->whenLoaded('serial', fn() => $this->serial->variant?->product?->name),
            'customer_name' => $this->whenLoaded('customer', fn() => $this->customer?->name),
            'start_date' => $this->start_date->toIso8601String(),
            'end_date' => $this->end_date->toIso8601String(),
            'status' => $this->status,
            'is_active' => $this->isActive(),
            'is_expired' => $this->isExpired(),
            'can_claim' => $this->canClaim(),
            'terms' => $this->terms,
            'claims_count' => $this->whenLoaded('claims', fn() => $this->claims->count()),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
