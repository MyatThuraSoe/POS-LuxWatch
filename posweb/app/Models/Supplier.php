<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Supplier extends Model
{
    use \Illuminate\Database\Eloquent\SoftDeletes;

    protected $fillable = [
        'company_name',
        'trade_license',
        'email',
        'phone',
        'address',
        'city',
        'country',
        'payment_terms',
        'lead_time_days',
        'currency',
        'rating',
        'status',
        'notes',
    ];

    protected $casts = [
        'lead_time_days' => 'integer',
        'rating' => 'integer',
    ];

    public function contacts(): HasMany
    {
        return $this->hasMany(SupplierContact::class);
    }

    public function purchaseOrders(): HasMany
    {
        return $this->hasMany(PurchaseOrder::class);
    }

    public function primaryContact(): BelongsTo
    {
        return $this->belongsTo(SupplierContact::class, 'id')
            ->where('is_primary', true)
            ->first();
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeNotBlacklisted($query)
    {
        return $query->where('status', '!=', 'blacklisted');
    }

    public function isBlacklisted(): bool
    {
        return $this->status === 'blacklisted';
    }
}
