<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class ReceiptTemplate extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'header_html',
        'footer_html',
        'warranty_text',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function receipts(): HasMany
    {
        return $this->hasMany(Receipt::class);
    }

    public static function getActive(): ?self
    {
        return static::where('is_active', true)->latest()->first();
    }
}
