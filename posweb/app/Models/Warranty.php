<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Warranty extends Model
{
    protected $fillable = [
        'sale_id',
        'serial_id',
        'customer_id',
        'start_date',
        'end_date',
        'status',
        'terms',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    public function sale(): BelongsTo
    {
        return $this->belongsTo(Sale::class);
    }

    public function serial(): BelongsTo
    {
        return $this->belongsTo(SerialNumber::class);
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function claims(): HasMany
    {
        return $this->hasMany(WarrantyClaim::class);
    }

    public function latestClaim(): HasOne
    {
        return $this->hasOne(WarrantyClaim::class)->latest();
    }

    public function isActive(): bool
    {
        return $this->status === 'active' && $this->end_date >= now();
    }

    public function isExpired(): bool
    {
        return $this->end_date < now() || $this->status === 'expired';
    }

    public function canClaim(): bool
    {
        return $this->status === 'active' && $this->end_date >= now();
    }
}
