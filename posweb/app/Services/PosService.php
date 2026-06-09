<?php

namespace App\Services;

use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\Payment;
use App\Models\Refund;
use App\Models\Discount;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

class PosService extends BaseService
{
    protected $cartKey;

    public function __construct()
    {
        $this->cartKey = 'pos_cart_' . (auth()->id() ?? 'guest');
    }

    public function getCart(): array
    {
        return Cache::get($this->cartKey, ['items' => [], 'discount_code' => null]);
    }

    public function addToCart(array $data): array
    {
        $cart = $this->getCart();
        
        // Find existing item or add new
        $found = false;
        foreach ($cart['items'] as &$item) {
            if ($item['variant_id'] == $data['variant_id']) {
                $item['quantity'] += $data['quantity'];
                $found = true;
                break;
            }
        }
        
        if (!$found) {
            $cart['items'][] = $data;
        }
        
        Cache::put($this->cartKey, $cart, 3600);
        return $cart;
    }

    public function updateCart(array $data): array
    {
        Cache::put($this->cartKey, ['items' => $data['items']], 3600);
        return $this->getCart();
    }

    public function clearCart(): void
    {
        Cache::forget($this->cartKey);
    }

    public function checkout(array $data, int $userId, ?string $idempotencyKey): array
    {
        return DB::transaction(function () use ($data, $userId, $idempotencyKey) {
            // Check idempotency
            if ($idempotencyKey && Cache::has('checkout_' . $idempotencyKey)) {
                throw new \Exception('Duplicate checkout request', 409);
            }

            $inventoryService = app(InventoryService::class);
            
            // Calculate totals
            $subtotal = 0;
            $discountAmount = 0;
            $taxAmount = 0;

            // Validate stock and calculate prices
            foreach ($data['items'] as &$item) {
                $variant = \App\Models\ProductVariant::with('product')->findOrFail($item['variant_id']);
                $inventory = \App\Models\InventoryItem::where('variant_id', $variant->id)->lockForUpdate()->first();
                
                if ($inventory->quantity < $item['quantity']) {
                    throw new \Exception("Insufficient stock for variant {$variant->sku}");
                }
                
                $lineTotal = $item['unit_price'] * $item['quantity'];
                $item['line_total'] = $lineTotal;
                $subtotal += $lineTotal;
            }

            // Apply discount if provided
            if (!empty($data['discount_code'])) {
                $discount = Discount::where('code', $data['discount_code'])
                    ->where('is_active', true)
                    ->where('expires_at', '>', now())
                    ->first();
                    
                if ($discount) {
                    if ($discount->type === 'percentage') {
                        $discountAmount = min($subtotal * ($discount->value / 100), $discount->max_discount ?? PHP_INT_MAX);
                    } else {
                        $discountAmount = min($discount->value, $subtotal);
                    }
                }
            }

            $totalAfterDiscount = $subtotal - $discountAmount;
            $taxAmount = round($totalAfterDiscount * 0.1, 2); // 10% tax example
            $totalAmount = $totalAfterDiscount + $taxAmount;

            // Validate payments
            $paymentTotal = collect($data['payments'])->sum('amount');
            if (abs($paymentTotal - $totalAmount) > 0.01) {
                throw new \Exception('Payment total must match order total');
            }

            // Create sale
            $sale = Sale::create([
                'sale_number' => 'SAL-' . date('Ymd') . '-' . str_pad(Sale::whereDate('created_at', today())->count() + 1, 4, '0', STR_PAD_LEFT),
                'cashier_id' => $userId,
                'status' => 'completed',
                'subtotal' => $subtotal,
                'discount_amount' => $discountAmount,
                'tax_amount' => $taxAmount,
                'total_amount' => $totalAmount,
                'payment_status' => 'paid',
                'notes' => $data['notes'] ?? null,
                'completed_at' => now(),
            ]);

            // Create sale items and deduct inventory
            foreach ($data['items'] as $item) {
                SaleItem::create([
                    'sale_id' => $sale->id,
                    'variant_id' => $item['variant_id'],
                    'serial_id' => $item['serial_id'] ?? null,
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'discount_amount' => $discountAmount > 0 ? ($item['line_total'] / $subtotal) * $discountAmount : 0,
                    'tax_amount' => ($item['line_total'] / $subtotal) * $taxAmount,
                    'line_total' => $item['line_total'],
                ]);

                // Deduct inventory
                $inventoryService->adjustStock(
                    $item['variant_id'],
                    -$item['quantity'],
                    "Sale {$sale->sale_number}",
                    [],
                    $userId
                );

                // Mark serial as sold if provided
                if (!empty($item['serial_id'])) {
                    $serial = \App\Models\SerialNumber::find($item['serial_id']);
                    if ($serial) {
                        $serial->update(['status' => 'sold', 'sale_id' => $sale->id]);
                    }
                }
            }

            // Create payments
            foreach ($data['payments'] as $paymentData) {
                Payment::create([
                    'sale_id' => $sale->id,
                    'method' => $paymentData['method'],
                    'amount' => $paymentData['amount'],
                    'reference' => $paymentData['reference'] ?? null,
                    'received_by' => $userId,
                    'processed_at' => now(),
                ]);
            }

            // Store idempotency key
            if ($idempotencyKey) {
                Cache::put('checkout_' . $idempotencyKey, $sale->id, 3600);
            }

            // Clear cart
            $this->clearCart();

            $this->audit('created', $sale, 'sale');
            
            return [
                'sale_id' => $sale->id,
                'sale_number' => $sale->sale_number,
                'total_amount' => $sale->total_amount,
                'payment_status' => $sale->payment_status,
                'receipt_url' => "/api/v1/pos/sales/{$sale->id}/receipt",
            ];
        });
    }

    public function getSalesHistory(array $filters = []): array
    {
        $query = Sale::query()->with(['cashier', 'items.variant']);

        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (isset($filters['date_from'])) {
            $query->whereDate('created_at', '>=', $filters['date_from']);
        }

        if (isset($filters['date_to'])) {
            $query->whereDate('created_at', '<=', $filters['date_to']);
        }

        return $query->orderBy('created_at', 'desc')->paginate(15);
    }

    public function getSaleDetails(int $id): array
    {
        $sale = Sale::with(['cashier', 'items.variant', 'payments', 'refunds'])->findOrFail($id);
        return $sale->toArray();
    }

    public function processRefund(int $saleId, array $data, int $userId): Refund
    {
        return DB::transaction(function () use ($saleId, $data, $userId) {
            $sale = Sale::with('items')->findOrFail($saleId);
            
            if ($sale->status === 'refunded') {
                throw new \Exception('Sale already fully refunded');
            }

            $totalRefunded = $sale->refunds()->sum('amount');
            $availableForRefund = $sale->total_amount - $totalRefunded;
            
            if ($data['amount'] > $availableForRefund) {
                throw new \Exception('Refund amount exceeds available balance');
            }

            $refund = Refund::create([
                'sale_id' => $saleId,
                'amount' => $data['amount'],
                'reason' => $data['reason'],
                'processed_by' => $userId,
                'status' => 'completed',
            ]);

            // Update sale status
            $totalRefundedAfter = $sale->refunds()->sum('amount');
            if ($totalRefundedAfter >= $sale->total_amount) {
                $sale->status = 'refunded';
            } else {
                $sale->status = 'partially_refunded';
            }
            $sale->save();

            $this->audit('refunded', $sale, 'sale', ['refund_id' => $refund->id]);
            
            return $refund;
        });
    }

    public function validateDiscount(string $code, $user): array
    {
        $discount = Discount::where('code', $code)
            ->where('is_active', true)
            ->first();

        if (!$discount) {
            return ['valid' => false, 'message' => 'Invalid discount code'];
        }

        if ($discount->expires_at && $discount->expires_at < now()) {
            return ['valid' => false, 'message' => 'Discount expired'];
        }

        // Check role restrictions
        if ($discount->role_restriction) {
            $roles = json_decode($discount->role_restriction, true);
            if (!in_array($user->getRoleNames()->first(), $roles)) {
                return ['valid' => false, 'message' => 'Discount not applicable for your role'];
            }
        }

        return [
            'valid' => true,
            'type' => $discount->type,
            'value' => $discount->value,
            'max_discount' => $discount->max_discount,
        ];
    }
}
