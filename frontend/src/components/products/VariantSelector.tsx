import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import type { ProductVariant } from '@/types/product';
import { Pencil, Trash2, Star } from 'lucide-react';

interface VariantSelectorProps {
  variants: ProductVariant[];
  selectedVariantId?: number;
  onSelect: (variantId: number) => void;
  onEdit?: (variantId: number) => void;
  onDelete?: (variantId: number) => void;
  onSetDefault?: (variantId: number) => void;
}

export function VariantSelector({
  variants,
  selectedVariantId,
  onSelect,
  onEdit,
  onDelete,
  onSetDefault,
}: VariantSelectorProps) {
  if (variants.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No variants available for this product.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {variants.map((variant) => (
        <Card
          key={variant.id}
          className={`cursor-pointer transition-all ${
            selectedVariantId === variant.id
              ? 'ring-2 ring-primary bg-primary/5'
              : 'hover:shadow-md'
          }`}
          onClick={() => onSelect(variant.id)}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h4 className="font-semibold">{variant.name}</h4>
                <p className="text-xs text-gray-500">SKU: {variant.sku}</p>
              </div>
              {variant.is_default && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-current" />
                  Default
                </Badge>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm mb-3">
              <div>
                <span className="text-gray-500">Price:</span>
                <span className="ml-1 font-medium">${variant.price.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-gray-500">Stock:</span>
                <span
                  className={`ml-1 font-medium ${
                    variant.quantity < (variant.low_stock_threshold || 10)
                      ? 'text-red-600'
                      : 'text-green-600'
                  }`}
                >
                  {variant.quantity}
                </span>
              </div>
            </div>

            {Object.keys(variant.attributes).length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {Object.entries(variant.attributes).map(([key, value]) => (
                  <Badge key={key} variant="outline" className="text-xs">
                    {key}: {value}
                  </Badge>
                ))}
              </div>
            )}

            <div className="flex items-center gap-2 pt-2 border-t">
              {onSetDefault && !variant.is_default && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    onSetDefault(variant.id);
                  }}
                  className="flex-1 text-xs"
                >
                  <Star className="h-3 w-3 mr-1" />
                  Set Default
                </Button>
              )}
              {onEdit && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    onEdit(variant.id);
                  }}
                >
                  <Pencil className="h-3 w-3" />
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    onDelete(variant.id);
                  }}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
