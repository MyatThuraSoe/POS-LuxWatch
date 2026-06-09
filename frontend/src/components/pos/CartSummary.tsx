import React from 'react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Clock, Eraser } from 'lucide-react';
import { usePOSStore } from '@/stores/posStore';
import { formatCurrency } from '@/lib/utils';

interface CartSummaryProps {
  onCheckout: () => void;
  onHoldCart: () => void;
  onClearCart: () => void;
}

export const CartSummary: React.FC<CartSummaryProps> = ({
  onCheckout,
  onHoldCart,
  onClearCart
}) => {
  const { 
    cart, 
    discount, 
    setDiscount, 
    discountType, 
    setTaxRate,
    taxRate,
    subtotal,
    discountAmount,
    taxAmount,
    total
  } = usePOSStore();

  const handleDiscountChange = (value: string) => {
    const numValue = parseFloat(value) || 0;
    if (discountType === 'percentage') {
      setDiscount(Math.min(100, Math.max(0, numValue)));
    } else {
      setDiscount(Math.min(subtotal, numValue));
    }
  };

  return (
    <div className="border-t p-4 space-y-4">
      {/* Discount Input */}
      <div className="flex items-center gap-2">
        <Label htmlFor="discount" className="text-sm">Discount</Label>
        <div className="flex items-center gap-1 flex-1">
          <Input
            id="discount"
            type="number"
            min="0"
            max={discountType === 'percentage' ? 100 : subtotal}
            value={discount}
            onChange={(e) => handleDiscountChange(e.target.value)}
            className="w-24 h-8"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDiscount(discount, discountType === 'percentage' ? 'fixed' : 'percentage')}
            className="h-8 text-xs"
          >
            {discountType === 'percentage' ? '%' : '$'}
          </Button>
        </div>
      </div>

      {/* Summary */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between text-muted-foreground">
          <span>Subtotal:</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        {discountAmount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount ({discountType === 'percentage' ? `${discount}%` : 'Fixed'}):</span>
            <span>-{formatCurrency(discountAmount)}</span>
          </div>
        )}
        <div className="flex justify-between text-muted-foreground">
          <span>Tax ({taxRate}%):</span>
          <span>{formatCurrency(taxAmount)}</span>
        </div>
        
        <Separator />
        
        <div className="flex justify-between text-lg font-bold">
          <span>Total:</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2 pt-2">
        <Button 
          variant="outline" 
          onClick={onClearCart}
          disabled={cart.length === 0}
        >
          Clear
        </Button>
        <Button 
          onClick={onCheckout}
          disabled={cart.length === 0}
          className="bg-green-600 hover:bg-green-700"
        >
          Checkout
        </Button>
      </div>
      
      <Button 
        variant="outline" 
        className="w-full"
        onClick={onHoldCart}
        disabled={cart.length === 0}
      >
        <Clock className="mr-2 h-4 w-4" /> Hold Cart
      </Button>
    </div>
  );
};
