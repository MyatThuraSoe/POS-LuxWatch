<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Services\CategoryService;
use Illuminate\Http\JsonResponse;

class CategoryController extends ApiController
{
    public function __construct(protected CategoryService $service) {}

    public function index(): JsonResponse
    {
        $categories = $this->service->getAll(request()->all());
        return $this->success(CategoryResource::collection($categories), 'Categories retrieved successfully');
    }

    public function tree(): JsonResponse
    {
        $tree = $this->service->getTree();
        return $this->success(CategoryResource::collection($tree), 'Category tree retrieved successfully');
    }

    public function store(StoreCategoryRequest $request): JsonResponse
    {
        $category = $this->service->create($request->validated());
        return $this->success(new CategoryResource($category), 'Category created successfully', 201);
    }

    public function show(int $id): JsonResponse
    {
        $category = $this->service->findById($id);
        return $this->success(new CategoryResource($category), 'Category retrieved successfully');
    }

    public function update(UpdateCategoryRequest $request, int $id): JsonResponse
    {
        $category = $this->service->update($id, $request->validated());
        return $this->success(new CategoryResource($category), 'Category updated successfully');
    }

    public function destroy(int $id): JsonResponse
    {
        $this->service->delete($id);
        return $this->success(null, 'Category deleted successfully');
    }
}
