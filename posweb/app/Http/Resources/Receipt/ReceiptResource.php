<?php

namespace App\Http\Resources\Receipt;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReceiptResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'sale_id' => $this->sale_id,
            'sale_number' => $this->sale->sale_number ?? null,
            'template_version' => $this->template_version,
            'qr_payload' => $this->qr_payload,
            'printed_at' => $this->printed_at?->toIso8601String(),
            'created_at' => $this->created_at?->toIso8601String(),
            'print_logs_count' => $this->printLogs->count(),
        ];
    }
}
