import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import type { Product, Brand, Category } from '@/types/product';
import { ProductStatusBadge } from './ProductStatusBadge';
import { X } from 'lucide-react';

interface ProductQuickViewProps {
  product: Product | null;
  brands: Brand[];
  categories: Category[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: () => void;
}

export function ProductQuickView({
  product,
  brands,
  categories,
  open,
  onOpenChange,
  onEdit,
}: ProductQuickViewProps) {
  if (!product) return null;

  const brand = brands.find((b) => b.id === product.brand_id);
  const category = categories.find((c) => c.id === product.category_id);

  const stockColor =
    product.total_quantity < 10
      ? 'text-red-600'
      : product.total_quantity < 20
      ? 'text-yellow-600'
      : 'text-green-600';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <DialogTitle className="text-2xl font-semibold">{product.name}</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div>
            {product.images?.[0]?.url ? (
              <img
                src={product.images[0].url}
                alt={product.name}
                className="w-full h-64 object-cover rounded-lg mb-2"
              />
            ) : (
              <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center mb-2">
                <span className="text-gray-400">No Image Available</span>
              </div>
            )}

            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {product.images.slice(1).map((img: { url: string }, idx: number) => (
                  <img
                    key={idx}
                    src={img.url}
                    alt={`${product.name} ${idx + 2}`}
                    className="w-16 h-16 object-cover rounded-md cursor-pointer hover:opacity-75"
                  />
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">SKU</h4>
              <p className="text-lg">{product.variants?.[0]?.sku || 'N/A'}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Brand</h4>
                <p>{brand?.name || 'N/A'}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Category</h4>
                <p>{category?.name || 'N/A'}</p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500">Type</h4>
              <Badge variant="outline" className="mt-1 capitalize">
                {product.type}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Price</h4>
                <p className="text-2xl font-bold">${product.base_price.toFixed(2)}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Cost Price</h4>
                <p className="text-lg">
                  ${product.cost_price?.toFixed(2) || 'N/A'}
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500">Stock Level</h4>
              <p className={`text-2xl font-bold ${stockColor}`}>{product.total_quantity}</p>
              {product.low_stock_threshold && (
                <p className="text-xs text-gray-500 mt-1">
                  Low stock threshold: {product.low_stock_threshold}
                </p>
              )}
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500">Status</h4>
              <div className="mt-1">
                <ProductStatusBadge status={product.status} />
              </div>
            </div>

            {product.description && (
              <div>
                <h4 className="text-sm font-medium text-gray-500">Description</h4>
                <p className="mt-1 text-sm">{product.description}</p>
              </div>
            )}

            <div className="pt-4 border-t flex gap-2">
              <Button onClick={onEdit} className="flex-1">
                Edit Product
              </Button>
              <Button variant="outline" className="flex-1">
                View Full Details
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
