<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Requests\StorePurchaseOrderRequest;
use App\Http\Requests\UpdatePurchaseOrderRequest;
use App\Http\Resources\PurchaseOrderResource;
use App\Services\PurchaseOrderService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PurchaseOrderController extends ApiController
{
    public function __construct(protected PurchaseOrderService $service) {}

    public function index(): JsonResponse
    {
        $orders = $this->service->getAll(request()->all());
        return $this->success(PurchaseOrderResource::collection($orders), 'Purchase orders retrieved successfully');
    }

    public function store(StorePurchaseOrderRequest $request): JsonResponse
    {
        $order = $this->service->create($request->validated());
        return $this->success(new PurchaseOrderResource($order), 'Purchase order created successfully', 201);
    }

    public function show(int $id): JsonResponse
    {
        $order = $this->service->findById($id);
        return $this->success(new PurchaseOrderResource($order), 'Purchase order retrieved successfully');
    }

    public function update(UpdatePurchaseOrderRequest $request, int $id): JsonResponse
    {
        $order = $this->service->update($id, $request->validated());
        return $this->success(new PurchaseOrderResource($order), 'Purchase order updated successfully');
    }

    public function approve(int $id): JsonResponse
    {
        $order = $this->service->approve($id, auth()->id());
        return $this->success(new PurchaseOrderResource($order), 'Purchase order approved successfully');
    }

    public function receive(int $id, Request $request): JsonResponse
    {
        $validated = $request->validate([
            'items' => 'required|array',
            'items.*.po_item_id' => 'required|exists:purchase_order_items,id',
            'items.*.quantity_received' => 'required|integer|min:1',
            'items.*.serial_numbers' => 'required|array',
            'items.*.condition' => 'required|in:good,damaged',
            'notes' => 'nullable|string|max:500',
        ]);
        
        $result = $this->service->receiveGoods($id, $validated, auth()->id());
        return $this->success($result, 'Goods received successfully');
    }

    public function cancel(int $id): JsonResponse
    {
        $order = $this->service->cancel($id, auth()->id());
        return $this->success(new PurchaseOrderResource($order), 'Purchase order cancelled successfully');
    }

    public function generatePdf(int $id): JsonResponse
    {
        $pdfUrl = $this->service->generatePdf($id);
        return $this->success(['pdf_url' => $pdfUrl], 'PDF generated successfully');
    }
}
