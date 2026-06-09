<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RepairJob extends Model
{
    protected $fillable = [
        'claim_id',
        'serial_id',
        'status',
        'diagnosis',
        'repair_cost',
        'technician_id',
        'estimated_completion',
    ];

    protected $casts = [
        'repair_cost' => 'decimal:2',
        'estimated_completion' => 'datetime',
    ];

    const SLA_DAYS = 7;

    public function claim(): BelongsTo
    {
        return $this->belongsTo(WarrantyClaim::class);
    }

    public function serial(): BelongsTo
    {
        return $this->belongsTo(SerialNumber::class);
    }

    public function technician(): BelongsTo
    {
        return $this->belongsTo(User::class, 'technician_id');
    }

    public function isOverdue(): bool
    {
        if ($this->status === 'completed' || $this->status === 'cancelled') {
            return false;
        }
        
        $deadline = $this->created_at->addDays(self::SLA_DAYS);
        return now()->gt($deadline);
    }

    public function getRemainingSlaDaysAttribute(): int
    {
        $deadline = $this->created_at->addDays(self::SLA_DAYS);
        return max(0, now()->diffInDays($deadline, false));
    }

    public function markAsReceived(): void
    {
        $this->update(['status' => 'received']);
    }

    public function markAsDiagnosing(string $diagnosis = null): void
    {
        $this->update([
            'status' => 'diagnosing',
            'diagnosis' => $diagnosis ?? $this->diagnosis,
        ]);
    }

    public function markAsRepairing(): void
    {
        $this->update(['status' => 'repairing']);
    }

    public function markAsReady(): void
    {
        $this->update(['status' => 'ready']);
    }

    public function markAsCompleted(): void
    {
        $this->update(['status' => 'completed']);
    }

    public function markAsCancelled(): void
    {
        $this->update(['status' => 'cancelled']);
    }
}
