import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { CartItem } from '@/types/pos';

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    price: number;
    stock: number;
    sku: string;
    category?: string;
  };
  onAddToCart: (product: {
    id: number;
    name: string;
    price: number;
    stock: number;
    sku: string;
    category?: string;
  }) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <Card
      className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
        isOutOfStock ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02]'
      }`}
      onClick={() => !isOutOfStock && onAddToCart(product)}
    >
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex justify-between items-start">
            <Badge 
              variant={
                isOutOfStock 
                  ? 'destructive' 
                  : isLowStock 
                    ? 'secondary' 
                    : 'default'
              }
              className="text-xs"
            >
              {isOutOfStock ? 'Out of Stock' : isLowStock ? `Only ${product.stock} left` : `${product.stock} in stock`}
            </Badge>
          </div>
          
          <div>
            <h3 className="font-semibold text-sm line-clamp-2">{product.name}</h3>
            <p className="text-xs text-muted-foreground mt-1">{product.sku}</p>
          </div>
          
          <div className="flex justify-between items-center">
            <p className="text-lg font-bold text-primary">
              ${product.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
            {product.category && (
              <Badge variant="outline" className="text-xs">
                {product.category}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
