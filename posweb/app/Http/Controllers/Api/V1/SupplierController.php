<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Requests\StoreSupplierRequest;
use App\Http\Requests\UpdateSupplierRequest;
use App\Http\Resources\SupplierResource;
use App\Services\SupplierService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SupplierController extends ApiController
{
    public function __construct(protected SupplierService $service) {}

    public function index(): JsonResponse
    {
        $suppliers = $this->service->getAll(request()->all());
        return $this->success(SupplierResource::collection($suppliers), 'Suppliers retrieved successfully');
    }

    public function store(StoreSupplierRequest $request): JsonResponse
    {
        $supplier = $this->service->create($request->validated());
        return $this->success(new SupplierResource($supplier), 'Supplier created successfully', 201);
    }

    public function show(int $id): JsonResponse
    {
        $supplier = $this->service->findById($id);
        return $this->success(new SupplierResource($supplier), 'Supplier retrieved successfully');
    }

    public function update(UpdateSupplierRequest $request, int $id): JsonResponse
    {
        $supplier = $this->service->update($id, $request->validated());
        return $this->success(new SupplierResource($supplier), 'Supplier updated successfully');
    }

    public function destroy(int $id): JsonResponse
    {
        $this->service->delete($id);
        return $this->success(null, 'Supplier deleted successfully');
    }

    public function addContact(int $id, Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'role' => 'nullable|string|max:50',
            'email' => 'required|email|max:150',
            'phone' => 'nullable|string|max:20',
            'is_primary' => 'boolean',
        ]);
        
        $contact = $this->service->addContact($id, $validated);
        return $this->success(['contact' => $contact], 'Contact added successfully', 201);
    }

    public function purchaseHistory(int $id): JsonResponse
    {
        $history = $this->service->getPurchaseHistory($id);
        return $this->success(['history' => $history], 'Purchase history retrieved successfully');
    }
}
