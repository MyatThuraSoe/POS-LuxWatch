import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Banknote, CreditCard, Wallet, Smartphone } from 'lucide-react';
import type { CheckoutData } from '@/types/pos';

interface PaymentFormProps {
  total: number;
  onSubmit: (data: CheckoutData) => void;
  onCancel: () => void;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({ total, onSubmit, onCancel }) => {
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'mixed' | 'wallet'>('cash');
  const [cashReceived, setCashReceived] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    const data: CheckoutData = {
      discount: 0,
      discountType: 'percentage',
      paymentMethod,
      notes,
    };

    if (paymentMethod === 'cash') {
      data.cashReceived = parseFloat(cashReceived) || total;
    } else if (paymentMethod === 'card') {
      data.cardNumber = cardNumber.slice(-4);
    }

    onSubmit(data);
  };

  const change = paymentMethod === 'cash' ? (parseFloat(cashReceived) || 0) - total : 0;

  return (
    <div className="space-y-4">
      {/* Payment Method Selection */}
      <div>
        <Label>Payment Method</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <Button
            variant={paymentMethod === 'cash' ? 'default' : 'outline'}
            onClick={() => setPaymentMethod('cash')}
            className="flex flex-col items-center py-4 h-auto"
          >
            <Banknote className="h-6 w-6 mb-2" />
            <span>Cash</span>
          </Button>
          <Button
            variant={paymentMethod === 'card' ? 'default' : 'outline'}
            onClick={() => setPaymentMethod('card')}
            className="flex flex-col items-center py-4 h-auto"
          >
            <CreditCard className="h-6 w-6 mb-2" />
            <span>Card</span>
          </Button>
          <Button
            variant={paymentMethod === 'mixed' ? 'default' : 'outline'}
            onClick={() => setPaymentMethod('mixed')}
            className="flex flex-col items-center py-4 h-auto"
          >
            <Wallet className="h-6 w-6 mb-2" />
            <span>Mixed</span>
          </Button>
          <Button
            variant={paymentMethod === 'wallet' ? 'default' : 'outline'}
            onClick={() => setPaymentMethod('wallet')}
            className="flex flex-col items-center py-4 h-auto"
          >
            <Smartphone className="h-6 w-6 mb-2" />
            <span>Wallet</span>
          </Button>
        </div>
      </div>

      {/* Payment Details */}
      {paymentMethod === 'cash' && (
        <div className="space-y-2">
          <Label htmlFor="cashReceived">Cash Received</Label>
          <Input
            id="cashReceived"
            type="number"
            value={cashReceived}
            onChange={(e) => setCashReceived(e.target.value)}
            placeholder="Enter amount received"
            autoFocus
          />
          {change >= 0 && (
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-sm text-green-700 dark:text-green-300">
                Change: <span className="font-bold">${change.toFixed(2)}</span>
              </p>
            </div>
          )}
          {change < 0 && (
            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
              <p className="text-sm text-amber-700 dark:text-amber-300">
                Still need: <span className="font-bold">${Math.abs(change).toFixed(2)}</span>
              </p>
            </div>
          )}
          
          {/* Quick Cash Buttons */}
          <div className="flex gap-2 flex-wrap">
            {[total, total * 1.1, total * 1.2].map((amount, i) => (
              <Button
                key={i}
                variant="outline"
                size="sm"
                onClick={() => setCashReceived(amount.toFixed(2))}
              >
                ${amount.toFixed(0)}
              </Button>
            ))}
          </div>
        </div>
      )}

      {paymentMethod === 'card' && (
        <div className="space-y-2">
          <Label htmlFor="cardNumber">Card Number (last 4 digits)</Label>
          <Input
            id="cardNumber"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value.slice(0, 4))}
            placeholder="1234"
            maxLength={4}
            autoFocus
          />
        </div>
      )}

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes">Notes (optional)</Label>
        <Input
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add any notes..."
        />
      </div>

      {/* Total Display */}
      <div className="p-4 bg-muted rounded-lg text-center">
        <p className="text-sm text-muted-foreground">Total Amount</p>
        <p className="text-2xl font-bold">${total.toFixed(2)}</p>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-4">
        <Button variant="outline" className="flex-1" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          className="flex-1 bg-green-600 hover:bg-green-700" 
          onClick={handleSubmit}
          disabled={
            (paymentMethod === 'cash' && change < 0) ||
            (paymentMethod === 'card' && cardNumber.length !== 4)
          }
        >
          Complete Sale
        </Button>
      </div>
    </div>
  );
};
