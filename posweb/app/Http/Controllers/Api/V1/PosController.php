<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Requests\CheckoutRequest;
use App\Services\PosService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PosController extends ApiController
{
    public function __construct(protected PosService $service) {}

    public function getCart(): JsonResponse
    {
        $cart = $this->service->getCart();
        return $this->successResponse(['cart' => $cart], 'Cart retrieved successfully');
    }

    public function addToCart(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'variant_id' => 'required|exists:product_variants,id',
            'quantity' => 'required|integer|min:1',
            'serial_id' => 'nullable|exists:serial_numbers,id',
        ]);
        
        $cart = $this->service->addToCart($validated);
        return $this->successResponse(['cart' => $cart], 'Item added to cart successfully');
    }

    public function updateCart(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'items' => 'required|array',
            'items.*.variant_id' => 'required|exists:product_variants,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);
        
        $cart = $this->service->updateCart($validated);
        return $this->successResponse(['cart' => $cart], 'Cart updated successfully');
    }

    public function clearCart(): JsonResponse
    {
        $this->service->clearCart();
        return $this->successResponse(null, 'Cart cleared successfully');
    }

    public function checkout(CheckoutRequest $request): JsonResponse
    {
        $result = $this->service->checkout(
            $request->validated(),
            auth()->id(),
            $request->header('X-Idempotency-Key')
        );
        return $this->successResponse($result, 'Sale completed successfully', 201);
    }

    public function salesHistory(): JsonResponse
    {
        $sales = $this->service->getSalesHistory(request()->all());
        return $this->successResponse(['sales' => $sales], 'Sales history retrieved successfully');
    }

    public function saleDetails(int $id): JsonResponse
    {
        $sale = $this->service->getSaleDetails($id);
        return $this->successResponse(['sale' => $sale], 'Sale details retrieved successfully');
    }

    public function refund(int $id, Request $request): JsonResponse
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:0.01',
            'reason' => 'required|string|max:255',
            'items' => 'nullable|array',
        ]);
        
        $refund = $this->service->processRefund($id, $validated, auth()->id());
        return $this->successResponse(['refund' => $refund], 'Refund processed successfully');
    }

    public function validateDiscount(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'code' => 'required|string|max:50',
            'cart_total' => 'required|numeric|min:0',
        ]);
        
        $result = $this->service->validateDiscount($validated['code'], auth()->user());
        return $this->successResponse($result, 'Discount validated successfully');
    }

    public function todaySummary(): JsonResponse
    {
        $summary = $this->service->getTodaySummary();
        return $this->successResponse($summary, 'Today\'s sales summary retrieved successfully');
    }

    public function salesToday(): JsonResponse
    {
        $today = now()->startOfDay();
        $sales = Sale::where('cashier_id', auth()->id())
            ->whereDate('created_at', $today)
            ->where('status', 'completed')
            ->get();

        return $this->successResponse([
            'sales_count'      => $sales->count(),
            'total_revenue'    => $sales->sum('total_amount'),
            'total_items_sold' => $sales->sum(fn ($s) => $s->items()->sum('quantity')),
        ], "Today's summary");
    }
}
