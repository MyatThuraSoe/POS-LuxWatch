<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class WarrantyClaim extends Model
{
    protected $fillable = [
        'warranty_id',
        'claim_number',
        'reason',
        'customer_description',
        'status',
        'submitted_by',
        'submitted_at',
        'resolved_at',
    ];

    protected $casts = [
        'submitted_at' => 'datetime',
        'resolved_at' => 'datetime',
    ];

    public static function boot()
    {
        parent::boot();

        static::creating(function ($claim) {
            if (!$claim->claim_number) {
                $date = now()->format('Ymd');
                $count = static::whereDate('created_at', today())->count() + 1;
                $claim->claim_number = "CLM-{$date}-" . str_pad($count, 3, '0', STR_PAD_LEFT);
            }
            if (!$claim->submitted_at) {
                $claim->submitted_at = now();
            }
        });
    }

    public function warranty(): BelongsTo
    {
        return $this->belongsTo(Warranty::class);
    }

    public function submittedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'submitted_by');
    }

    public function repairJob(): HasOne
    {
        return $this->hasOne(RepairJob::class);
    }

    public function approve(): void
    {
        $this->update([
            'status' => 'approved',
            'resolved_at' => now(),
        ]);
    }

    public function reject(): void
    {
        $this->update([
            'status' => 'rejected',
            'resolved_at' => now(),
        ]);
    }
}
