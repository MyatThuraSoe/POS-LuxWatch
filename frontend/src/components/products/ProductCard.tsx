import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Product } from '@/types/product';
import { ProductStatusBadge } from './ProductStatusBadge';
import { Pencil, Trash2, Eye } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  brandName?: string;
  categoryName?: string;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onView: (id: number) => void;
}

export function ProductCard({
  product,
  brandName = 'N/A',
  categoryName = 'N/A',
  onEdit,
  onDelete,
  onView,
}: ProductCardProps) {
  const stockColor =
    product.total_quantity < 10
      ? 'text-red-600'
      : product.total_quantity < 20
      ? 'text-yellow-600'
      : 'text-green-600';

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-square bg-gray-100 relative">
        {product.images?.[0]?.url ? (
          <img
            src={product.images[0].url}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <span className="text-sm">No Image</span>
          </div>
        )}
        <div className="absolute top-2 right-2">
          <ProductStatusBadge status={product.status} />
        </div>
      </div>
      <CardContent className="p-4">
        <div className="mb-2">
          <h3 className="font-semibold text-lg truncate">{product.name}</h3>
          <p className="text-xs text-gray-500">SKU: {product.variants?.[0]?.sku || 'N/A'}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-sm mb-3">
          <div>
            <span className="text-gray-500">Brand:</span>
            <span className="ml-1 font-medium">{brandName}</span>
          </div>
          <div>
            <span className="text-gray-500">Category:</span>
            <span className="ml-1 font-medium">{categoryName}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-gray-500 text-sm">Price:</span>
            <span className="ml-1 font-bold text-lg">${product.base_price.toFixed(2)}</span>
          </div>
          <div>
            <span className="text-gray-500 text-sm">Stock:</span>
            <span className={`ml-1 font-bold ${stockColor}`}>{product.total_quantity}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-3 border-t">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onView(product.id)}
          >
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onEdit(product.id)}
          >
            <Pencil className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-red-600 hover:text-red-700"
            onClick={() => onDelete(product.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
