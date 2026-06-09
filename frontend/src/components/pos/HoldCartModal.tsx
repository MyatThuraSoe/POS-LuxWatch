import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { usePOSStore } from '@/stores/posStore';
import { useToast } from '@/hooks/use-toast';

interface HoldCartModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const HoldCartModal: React.FC<HoldCartModalProps> = ({ open, onOpenChange }) => {
  const { holdCart, setIsHoldCartOpen, clearCart } = usePOSStore();
  const { toast } = useToast();
  const [note, setNote] = useState('');
  const [customerName, setCustomerName] = useState('');

  const handleHold = () => {
    const holdNote = customerName 
      ? `${note ? `Customer: ${customerName}. ${note}` : `Customer: ${customerName}`}`
      : note;
    
    holdCart(holdNote || undefined);
    toast({
      title: "Cart Held",
      description: "You can recall this cart anytime from the Recall button"
    });
    setNote('');
    setCustomerName('');
    onOpenChange(false);
    setIsHoldCartOpen(false);
  };

  const handleClose = () => {
    setNote('');
    setCustomerName('');
    onOpenChange(false);
    setIsHoldCartOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Hold Cart</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="customerName">Customer Name (optional)</Label>
            <Input
              id="customerName"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Enter customer name for easy recall"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="note">Note (optional)</Label>
            <Textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note to help you remember this order..."
              rows={3}
            />
          </div>
          
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={handleHold}>
              Hold Cart
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
