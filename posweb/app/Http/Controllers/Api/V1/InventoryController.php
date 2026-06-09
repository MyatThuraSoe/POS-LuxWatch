<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Requests\AdjustInventoryRequest;
use App\Http\Requests\RegisterSerialRequest;
use App\Http\Resources\InventoryResource;
use App\Services\InventoryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InventoryController extends ApiController
{
    public function __construct(protected InventoryService $service) {}

    public function index(): JsonResponse
    {
        $inventory = $this->service->getAll(request()->all());
        return $this->success(InventoryResource::collection($inventory), 'Inventory retrieved successfully');
    }

    public function show(int $variant_id): JsonResponse
    {
        $item = $this->service->getByVariantId($variant_id);
        return $this->success(new InventoryResource($item), 'Inventory item retrieved successfully');
    }

    public function adjust(AdjustInventoryRequest $request): JsonResponse
    {
        $result = $this->service->adjustStock(
            $request->validated('variant_id'),
            $request->validated('new_quantity'),
            $request->validated('reason'),
            $request->validated('serials_added', []),
            auth()->id()
        );
        return $this->success($result, 'Stock adjusted successfully');
    }

    public function movements(): JsonResponse
    {
        $movements = $this->service->getMovements(request()->all());
        return $this->success(['movements' => $movements], 'Stock movements retrieved successfully');
    }

    public function lowStock(): JsonResponse
    {
        $items = $this->service->getLowStockItems();
        return $this->success(['items' => $items], 'Low stock items retrieved successfully');
    }

    public function alerts(): JsonResponse
    {
        $items = $this->service->getLowStockItems();
        return $this->success(['alerts' => $items], 'Inventory alerts retrieved successfully');
    }

    public function registerSerial(RegisterSerialRequest $request): JsonResponse
    {
        $serial = $this->service->registerSerial(
            $request->validated('variant_id'),
            $request->validated('serial_code')
        );
        return $this->success(['serial' => $serial], 'Serial number registered successfully', 201);
    }

    public function getSerial(string $code): JsonResponse
    {
        $serial = $this->service->getSerialByCode($code);
        return $this->success(['serial' => $serial], 'Serial number retrieved successfully');
    }
}
