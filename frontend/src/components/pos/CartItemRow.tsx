import React from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { CartItem } from '@/types/pos';

interface CartItemRowProps {
  item: CartItem;
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemove: (productId: number) => void;
}

export const CartItemRow: React.FC<CartItemRowProps> = ({ 
  item, 
  onUpdateQuantity, 
  onRemove 
}) => {
  const itemTotal = item.price * item.quantity;

  return (
    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
      <div className="flex-1 min-w-0 space-y-1">
        <p className="text-sm font-medium truncate">{item.name}</p>
        <p className="text-xs text-muted-foreground">{item.sku}</p>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            ${item.price.toLocaleString()} × {item.quantity}
          </span>
          {item.stock <= 5 && (
            <span className="text-xs text-amber-500">
              Only {item.stock} left
            </span>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          size="icon"
          variant="outline"
          className="h-8 w-8"
          onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
          disabled={item.quantity <= 1}
        >
          <Minus className="h-3 w-3" />
        </Button>
        
        <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
        
        <Button
          size="icon"
          variant="outline"
          className="h-8 w-8"
          onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
          disabled={item.quantity >= item.stock}
        >
          <Plus className="h-3 w-3" />
        </Button>
        
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 text-destructive hover:bg-destructive/10"
          onClick={() => onRemove(item.productId)}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
      
      <div className="w-20 text-right ml-4">
        <p className="text-sm font-semibold">
          ${itemTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </p>
      </div>
    </div>
  );
};
