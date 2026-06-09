<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Http\Resources\ProductResource;
use App\Services\ProductService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends ApiController
{
    public function __construct(protected ProductService $service) {}

    public function index(): JsonResponse
    {
        $products = $this->service->getAll(request()->all());
        return $this->success(ProductResource::collection($products), 'Products retrieved successfully');
    }

    public function store(StoreProductRequest $request): JsonResponse
    {
        $product = $this->service->create($request->validated());
        return $this->success(new ProductResource($product), 'Product created successfully', 201);
    }

    public function show(int $id): JsonResponse
    {
        $product = $this->service->findById($id);
        return $this->success(new ProductResource($product), 'Product retrieved successfully');
    }

    public function update(UpdateProductRequest $request, int $id): JsonResponse
    {
        $product = $this->service->update($id, $request->validated());
        return $this->success(new ProductResource($product), 'Product updated successfully');
    }

    public function destroy(int $id): JsonResponse
    {
        $this->service->delete($id);
        return $this->success(null, 'Product deleted successfully');
    }

    public function addVariant(int $id, Request $request): JsonResponse
    {
        $validated = $request->validate([
            'sku' => 'required|string|max:50|unique:product_variants,sku',
            'attributes' => 'nullable|array|max:5000',
            'barcode' => 'nullable|string|max:100|unique:product_variants,barcode',
            'price_override' => 'nullable|numeric|min:0|max:999999.99',
        ]);
        
        $variant = $this->service->addVariant($id, $validated);
        return $this->success(['variant' => $variant], 'Variant added successfully', 201);
    }

    public function uploadImages(int $id, Request $request): JsonResponse
    {
        $validated = $request->validate([
            'images' => 'required|array|max:10',
            'images.*' => 'image|mimes:jpeg,png,webp|max:5120',
            'variant_id' => 'nullable|exists:product_variants,id',
        ]);
        
        $images = $this->service->uploadImages($id, $validated);
        return $this->success(['images' => $images], 'Images uploaded successfully', 201);
    }
}
