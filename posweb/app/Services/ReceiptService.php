<?php

namespace App\Services;

use App\Models\Receipt;
use App\Models\ReceiptTemplate;
use App\Models\PrintLog;
use App\Models\Sale;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ReceiptService
{
    public function generateReceiptData(Sale $sale): array
    {
        $template = ReceiptTemplate::getActive();
        
        $items = $sale->items->map(function ($item) {
            return [
                'name' => $item->variant->product->name,
                'sku' => $item->variant->sku,
                'quantity' => $item->quantity,
                'unit_price' => $item->unit_price,
                'discount' => $item->discount_amount,
                'tax' => $item->tax_amount,
                'line_total' => $item->line_total,
                'serial' => $item->serial?->serial_code,
                'warranty_months' => $item->variant->product->warranty_months ?? 0,
            ];
        })->toArray();

        $payments = $sale->payments->map(function ($payment) {
            return [
                'method' => ucfirst($payment->method),
                'amount' => $payment->amount,
                'reference' => $payment->reference,
            ];
        })->toArray();

        $storeInfo = [
            'name' => config('app.name', 'WatchHub'),
            'address' => config('settings.store_address', '123 Main Street'),
            'phone' => config('settings.store_phone', '+1-555-0100'),
            'email' => config('settings.store_email', 'info@watchhub.com'),
        ];

        $warrantyText = $template?->warranty_text ?? 'Standard manufacturer warranty applies. Keep this receipt as proof of purchase.';

        $qrPayloadData = [
            'sale_id' => $sale->id,
            'sale_number' => $sale->sale_number,
            'total_amount' => $sale->total_amount,
            'timestamp' => $sale->completed_at?->toIso8601String() ?? now()->toIso8601String(),
        ];

        $qrPayload = base64_encode(json_encode($qrPayloadData));

        return [
            'sale_number' => $sale->sale_number,
            'sale_date' => $sale->completed_at?->toIso8601String() ?? $sale->created_at->toIso8601String(),
            'cashier' => $sale->cashier->name,
            'customer' => $sale->customer?->name,
            'store_info' => $storeInfo,
            'items' => $items,
            'subtotal' => $sale->subtotal,
            'discount' => $sale->discount_amount,
            'tax' => $sale->tax_amount,
            'total' => $sale->total_amount,
            'payments' => $payments,
            'warranty' => $warrantyText,
            'qr_data' => $qrPayload,
            'template' => [
                'header' => $template?->header_html ?? '<h1>' . config('app.name') . '</h1>',
                'footer' => $template?->footer_html ?? '<p>Thank you for your business!</p>',
            ],
        ];
    }

    public function logPrint(
        Sale $sale,
        User $user,
        string $terminalId,
        string $action = 'initial',
        ?string $reason = null,
        string $status = 'success'
    ): PrintLog {
        return DB::transaction(function () use ($sale, $user, $terminalId, $action, $reason, $status) {
            $receipt = Receipt::firstOrCreate(
                ['sale_id' => $sale->id],
                [
                    'template_id' => ReceiptTemplate::getActive()?->id,
                    'template_version' => '1.0',
                    'printed_at' => $action === 'initial' ? now() : null,
                ]
            );

            if ($action === 'initial' && !$receipt->printed_at) {
                $receipt->update([
                    'printed_at' => now(),
                    'qr_payload' => $this->generateReceiptData($sale)['qr_data'],
                ]);
            }

            return PrintLog::create([
                'receipt_id' => $receipt->id,
                'user_id' => $user->id,
                'terminal_id' => $terminalId,
                'action' => $action,
                'reason' => $reason,
                'status' => $status,
                'printed_at' => now(),
            ]);
        });
    }

    public function getReceiptBySaleId(int $saleId): ?Receipt
    {
        return Receipt::where('sale_id', $saleId)
            ->with(['template', 'printLogs.user'])
            ->first();
    }

    public function getPrintLogs(array $filters = [], int $perPage = 50)
    {
        $query = PrintLog::with(['receipt.sale', 'user']);

        if (isset($filters['user_id'])) {
            $query->where('user_id', $filters['user_id']);
        }

        if (isset($filters['action'])) {
            $query->where('action', $filters['action']);
        }

        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (isset($filters['date_from'])) {
            $query->whereDate('created_at', '>=', $filters['date_from']);
        }

        if (isset($filters['date_to'])) {
            $query->whereDate('created_at', '<=', $filters['date_to']);
        }

        return $query->orderByDesc('created_at')->paginate($perPage);
    }

    public function updateTemplate(array $data, int $templateId): ReceiptTemplate
    {
        $template = ReceiptTemplate::findOrFail($templateId);
        
        // Sanitize HTML (basic - consider using HTMLPurifier in production)
        $allowedTags = '<p><br><h1><h2><h3><h4><h5><h6><strong><em><u><span><div>';
        $data['header_html'] = strip_tags($data['header_html'] ?? '', $allowedTags);
        $data['footer_html'] = strip_tags($data['footer_html'] ?? '', $allowedTags);
        $data['warranty_text'] = strip_tags($data['warranty_text'] ?? '', $allowedTags);

        $template->update($data);
        
        return $template->fresh();
    }

    public function createDefaultTemplate(): ReceiptTemplate
    {
        return ReceiptTemplate::create([
            'name' => 'Default Template',
            'header_html' => '<h1 style="text-align:center;">' . config('app.name') . '</h1><p style="text-align:center;">Thank you for your purchase!</p>',
            'footer_html' => '<p style="text-align:center;">No returns after 14 days. Warranty valid with receipt.</p>',
            'warranty_text' => 'This product is covered by manufacturer warranty. Please retain this receipt for warranty claims.',
            'is_active' => true,
        ]);
    }
}
