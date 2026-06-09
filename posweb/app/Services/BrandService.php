<?php

namespace App\Services;

use App\Models\Brand;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class BrandService extends BaseService
{
    public function getAll(array $filters = [])
    {
        $query = Brand::query();

        if (isset($filters['search'])) {
            $query->where('name', 'ilike', "%{$filters['search']}%");
        }

        if (isset($filters['status'])) {
            $query->where('is_active', $filters['status'] === 'active');
        }

        return $query->withCount('products')->orderBy('name')->paginate(15);
    }

    public function findById(int $id): Brand
    {
        return Brand::withCount('products')->findOrFail($id);
    }

    public function create(array $data): Brand
    {
        return DB::transaction(function () use ($data) {
            if (!isset($data['slug'])) {
                $data['slug'] = Str::slug($data['name']);
            }
            
            $brand = Brand::create($data);
            $this->audit('created', $brand, 'brand');
            return $brand;
        });
    }

    public function update(int $id, array $data): Brand
    {
        return DB::transaction(function () use ($id, $data) {
            $brand = Brand::findOrFail($id);
            
            if (isset($data['name']) && !isset($data['slug'])) {
                $data['slug'] = Str::slug($data['name']);
            }
            
            $brand->update($data);
            $this->audit('updated', $brand, 'brand');
            return $brand->fresh();
        });
    }

    public function delete(int $id): void
    {
        DB::transaction(function () use ($id) {
            $brand = Brand::findOrFail($id);
            $this->audit('deleted', $brand, 'brand');
            $brand->delete();
        });
    }
}
