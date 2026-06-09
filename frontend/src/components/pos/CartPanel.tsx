import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart } from 'lucide-react';
import { CartItemRow } from './CartItemRow';
import { usePOSStore } from '@/stores/posStore';

export const CartPanel: React.FC = () => {
  const { cart, updateCartItem, removeCartItem } = usePOSStore();

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
        <ShoppingCart className="h-16 w-16 mb-4 opacity-20" />
        <p className="text-lg font-medium">Cart is empty</p>
        <p className="text-sm">Add products to start a sale</p>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1 px-4">
      <div className="space-y-2 pb-4">
        {cart.map(item => (
          <CartItemRow
            key={item.productId}
            item={item}
            onUpdateQuantity={updateCartItem}
            onRemove={removeCartItem}
          />
        ))}
      </div>
    </ScrollArea>
  );
};
