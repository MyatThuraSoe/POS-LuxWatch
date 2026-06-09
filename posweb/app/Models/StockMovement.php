<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StockMovement extends Model
{
    protected $fillable = [
        'variant_id',
        'serial_id',
        'type',
        'quantity_change',
        'reference_type',
        'reference_id',
        'reason',
        'performed_by',
    ];

    protected $casts = [
        'quantity_change' => 'integer',
        'reference_id' => 'integer',
    ];

    public function variant(): BelongsTo
    {
        return $this->belongsTo(ProductVariant::class, 'variant_id');
    }

    public function serial(): BelongsTo
    {
        return $this->belongsTo(SerialNumber::class, 'serial_id');
    }

    public function performedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'performed_by');
    }

    public function reference()
    {
        if ($this->reference_type && $this->reference_id) {
            return app($this->reference_type)->find($this->reference_id);
        }

        return null;
    }

    public function scopeType($query, $type)
    {
        return $query->where('type', $type);
    }

    public function scopeForVariant($query, $variantId)
    {
        return $query->where('variant_id', $variantId);
    }
}
