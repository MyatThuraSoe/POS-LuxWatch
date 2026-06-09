<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InventoryItem extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'variant_id',
        'quantity',
        'low_stock_threshold',
        'reserved_quantity',
    ];

    protected $casts = [
        'quantity' => 'integer',
        'low_stock_threshold' => 'integer',
        'reserved_quantity' => 'integer',
    ];

    public function variant(): BelongsTo
    {
        return $this->belongsTo(ProductVariant::class, 'variant_id');
    }

    public function getAvailableQuantityAttribute(): int
    {
        return $this->quantity - $this->reserved_quantity;
    }

    public function isLowStock(): bool
    {
        return $this->available_quantity <= $this->low_stock_threshold;
    }

    public function scopeLowStock($query)
    {
        return $query->whereRaw('quantity - reserved_quantity <= low_stock_threshold');
    }

    public function scopeOutOfStock($query)
    {
        return $query->whereRaw('quantity - reserved_quantity <= 0');
    }
}
