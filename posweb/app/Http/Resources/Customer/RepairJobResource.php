<?php

namespace App\Http\Resources\Customer;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RepairJobResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'claim_id' => $this->claim_id,
            'claim_number' => $this->whenLoaded('claim', fn() => $this->claim->claim_number),
            'serial_code' => $this->whenLoaded('serial', fn() => $this->serial->serial_code),
            'product_name' => $this->whenLoaded('serial', fn() => $this->serial->variant?->product?->name),
            'status' => $this->status,
            'diagnosis' => $this->diagnosis,
            'repair_cost' => $this->repair_cost,
            'technician_name' => $this->whenLoaded('technician', fn() => $this->technician?->name),
            'estimated_completion' => $this->estimated_completion?->toIso8601String(),
            'is_overdue' => $this->isOverdue(),
            'remaining_sla_days' => $this->remaining_sla_days,
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
