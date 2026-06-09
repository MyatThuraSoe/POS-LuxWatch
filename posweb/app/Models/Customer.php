<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Customer extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'address',
        'notes',
    ];

    public function sales(): HasMany
    {
        return $this->hasMany(Sale::class);
    }

    public function warranties(): HasMany
    {
        return $this->hasMany(Warranty::class);
    }

    public function getPurchaseHistoryAttribute(): array
    {
        return $this->sales()
            ->with('items.variant.product.brand')
            ->orderByDesc('created_at')
            ->get()
            ->map(function ($sale) {
                return [
                    'sale_id' => $sale->id,
                    'sale_number' => $sale->sale_number,
                    'total' => $sale->total_amount,
                    'date' => $sale->created_at->toIso8601String(),
                    'items_count' => $sale->items->count(),
                ];
            })
            ->toArray();
    }
}
