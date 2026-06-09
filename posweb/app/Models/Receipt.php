<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Crypt;

class Receipt extends Model
{
    protected $fillable = [
        'sale_id',
        'template_id',
        'template_version',
        'qr_payload',
        'printed_at',
    ];

    protected $casts = [
        'printed_at' => 'datetime',
    ];

    public function sale(): BelongsTo
    {
        return $this->belongsTo(Sale::class);
    }

    public function template(): BelongsTo
    {
        return $this->belongsTo(ReceiptTemplate::class);
    }

    public function printLogs(): HasMany
    {
        return $this->hasMany(PrintLog::class);
    }

    public function generateQrPayload(array $saleData): string
    {
        $payload = json_encode([
            'sale_id' => $this->sale_id,
            'sale_number' => $saleData['sale_number'] ?? null,
            'total' => $saleData['total_amount'] ?? null,
            'timestamp' => now()->toIso8601String(),
            'hash' => hash_hmac('sha256', $this->sale_id . now()->timestamp, config('app.key'))
        ]);
        
        return base64_encode($payload);
    }
}
