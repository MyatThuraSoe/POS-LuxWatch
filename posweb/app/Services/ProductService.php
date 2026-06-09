<?php

namespace App\Services;

use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\ProductImage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class ProductService extends BaseService
{
    public function getAll(array $filters = [])
    {
        $query = Product::query()->with(['category', 'brand']);

        if (isset($filters['search'])) {
            $query->where('name', 'ilike', "%{$filters['search']}%");
        }

        if (isset($filters['type'])) {
            $query->where('type', $filters['type']);
        }

        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (isset($filters['category_id'])) {
            $query->where('category_id', $filters['category_id']);
        }

        if (isset($filters['brand_id'])) {
            $query->where('brand_id', $filters['brand_id']);
        }

        return $query->withCount(['variants', 'images'])->orderBy('name')->paginate(15);
    }

    public function findById(int $id): Product
    {
        return Product::with(['category', 'brand', 'variants', 'images'])->findOrFail($id);
    }

    public function create(array $data): Product
    {
        return DB::transaction(function () use ($data) {
            if (!isset($data['slug'])) {
                $data['slug'] = Str::slug($data['name']);
            }

            if (!isset($data['sku_base']) && isset($data['brand_id'])) {
                $brand = \App\Models\Brand::find($data['brand_id']);
                $brandCode = strtoupper(substr(preg_replace('/[^a-zA-Z]/', '', $brand->name), 0, 3));
                $typeCode = strtoupper(substr($data['type'], 0, 2));
                $seq = str_pad(Product::where('brand_id', $data['brand_id'])->count() + 1, 4, '0', STR_PAD_LEFT);
                $data['sku_base'] = "{$brandCode}-{$typeCode}-{$seq}";
            }

            $variants = $data['variants'] ?? [];
            unset($data['variants']);

            $product = Product::create($data);

            foreach ($variants as $variantData) {
                $variantData['product_id'] = $product->id;
                if (!isset($variantData['sku'])) {
                    $variantData['sku'] = $product->sku_base . '-' . strtoupper(Str::random(4));
                }
                ProductVariant::create($variantData);
            }

            $this->audit('created', $product, 'product');
            return $product;
        });
    }

    public function update(int $id, array $data): Product
    {
        return DB::transaction(function () use ($id, $data) {
            $product = Product::findOrFail($id);
            
            if (isset($data['name']) && !isset($data['slug'])) {
                $data['slug'] = Str::slug($data['name']);
            }

            $product->update($data);
            $this->audit('updated', $product, 'product');
            return $product->fresh();
        });
    }

    public function delete(int $id): void
    {
        DB::transaction(function () use ($id) {
            $product = Product::findOrFail($id);
            $this->audit('deleted', $product, 'product');
            $product->delete();
        });
    }

    public function addVariant(int $productId, array $data): ProductVariant
    {
        return DB::transaction(function () use ($productId, $data) {
            $product = Product::findOrFail($productId);
            
            if (!isset($data['sku'])) {
                $data['sku'] = $product->sku_base . '-' . strtoupper(Str::random(4));
            }

            $data['product_id'] = $productId;
            $variant = ProductVariant::create($data);

            // Create inventory item for variant
            \App\Models\InventoryItem::create([
                'variant_id' => $variant->id,
                'quantity' => 0,
                'reserved_quantity' => 0,
                'low_stock_threshold' => 5,
            ]);

            return $variant;
        });
    }

    public function uploadImages(int $productId, array $data): array
    {
        $images = [];
        $product = Product::findOrFail($productId);
        $variantId = $data['variant_id'] ?? null;

        foreach ($data['images'] as $index => $image) {
            if ($image instanceof UploadedFile) {
                $path = $image->store("products/{$productId}", 'public');
                
                $productImage = ProductImage::create([
                    'product_id' => $productId,
                    'variant_id' => $variantId,
                    'url' => $path,
                    'sort_order' => $index,
                ]);
                
                $images[] = $productImage;
            }
        }

        return $images;
    }
}
