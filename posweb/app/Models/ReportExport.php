<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class ReportExport extends Model
{
    protected $fillable = [
        'user_id',
        'type',
        'report_type',
        'filters',
        'status',
        'file_path',
        'expires_at',
    ];

    protected $casts = [
        'filters' => 'array',
        'expires_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function getDownloadUrlAttribute(): ?string
    {
        if (!$this->file_path || !Storage::exists($this->file_path)) {
            return null;
        }
        
        // Generate temporary signed URL (valid for 1 hour)
        return Storage::temporaryUrl($this->file_path, now()->addHour());
    }

    public function isExpired(): bool
    {
        return $this->expires_at && $this->expires_at->isPast();
    }

    public function cleanupOldExports()
    {
        // Delete records older than 30 days
        $oldExports = self::where('created_at', '<', now()->subDays(30))->get();
        
        foreach ($oldExports as $export) {
            if ($export->file_path && Storage::exists($export->file_path)) {
                Storage::delete($export->file_path);
            }
            $export->delete();
        }
    }
}
