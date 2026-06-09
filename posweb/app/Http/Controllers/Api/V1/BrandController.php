<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Requests\StoreBrandRequest;
use App\Http\Requests\UpdateBrandRequest;
use App\Http\Resources\BrandResource;
use App\Services\BrandService;
use Illuminate\Http\JsonResponse;

class BrandController extends ApiController
{
    public function __construct(protected BrandService $service) {}

    public function index(): JsonResponse
    {
        $brands = $this->service->getAll(request()->all());
        return $this->success(BrandResource::collection($brands), 'Brands retrieved successfully');
    }

    public function store(StoreBrandRequest $request): JsonResponse
    {
        $brand = $this->service->create($request->validated());
        return $this->success(new BrandResource($brand), 'Brand created successfully', 201);
    }

    public function show(int $id): JsonResponse
    {
        $brand = $this->service->findById($id);
        return $this->success(new BrandResource($brand), 'Brand retrieved successfully');
    }

    public function update(UpdateBrandRequest $request, int $id): JsonResponse
    {
        $brand = $this->service->update($id, $request->validated());
        return $this->success(new BrandResource($brand), 'Brand updated successfully');
    }

    public function destroy(int $id): JsonResponse
    {
        $this->service->delete($id);
        return $this->success(null, 'Brand deleted successfully');
    }
}
