<?php

namespace App\Http\Resources\Customer;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CustomerResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'address' => $this->address,
            'notes' => $this->notes,
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
            'purchase_history' => $this->when(
                $request->routeIs('customers.show') || $request->routeIs('customers.history'),
                $this->purchase_history
            ),
            'warranties_count' => $this->whenLoaded('warranties', fn() => $this->warranties->count()),
        ];
    }
}
