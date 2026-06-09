<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Discount extends Model
{
    protected $fillable = [
        'code',
        'type',
        'value',
        'max_discount',
        'role_restriction',
        'starts_at',
        'expires_at',
        'is_active',
    ];

    protected $casts = [
        'value' => 'decimal:2',
        'max_discount' => 'decimal:2',
        'starts_at' => 'datetime',
        'expires_at' => 'datetime',
        'is_active' => 'boolean',
    ];

    public function scopeActive($query)
    {
        return $query->where('is_active', true)
            ->whereNull('expires_at')
            ->orWhere('expires_at', '>', now());
    }

    public function scopeCode($query, $code)
    {
        return $query->where('code', $code);
    }

    public function isValid(): bool
    {
        if (!$this->is_active) {
            return false;
        }

        if ($this->expires_at && $this->expires_at->isPast()) {
            return false;
        }

        if ($this->starts_at && $this->starts_at->isFuture()) {
            return false;
        }

        return true;
    }

    public function isRestrictedToRole(?string $role): bool
    {
        if (empty($this->role_restriction)) {
            return true;
        }

        return $this->role_restriction === $role;
    }
}
