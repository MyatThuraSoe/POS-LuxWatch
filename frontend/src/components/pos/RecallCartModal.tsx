import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Clock, Trash2, ShoppingCart } from 'lucide-react';
import { usePOSStore } from '@/stores/posStore';
import { useToast } from '@/hooks/use-toast';

interface RecallCartModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const RecallCartModal: React.FC<RecallCartModalProps> = ({ open, onOpenChange }) => {
  const { heldCarts, recallCart, deleteHeldCart, setIsRecallCartOpen } = usePOSStore();
  const { toast } = useToast();

  const handleRecall = (cartId: string) => {
    recallCart(cartId);
    toast({
      title: "Cart Recalled",
      description: "The held cart has been restored to the current sale"
    });
    onOpenChange(false);
    setIsRecallCartOpen(false);
  };

  const handleDelete = (cartId: string) => {
    deleteHeldCart(cartId);
    toast({
      title: "Cart Deleted",
      description: "The held cart has been removed"
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Recall Held Cart</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          {heldCarts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
              <Clock className="h-12 w-12 mb-2 opacity-20" />
              <p>No held carts</p>
            </div>
          ) : (
            <ScrollArea className="h-64">
              <div className="space-y-2">
                {heldCarts.map(cart => (
                  <div
                    key={cart.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                        <p className="font-medium truncate">
                          {cart.customerName || `Cart #${cart.id.slice(-6)}`}
                        </p>
                      </div>
                      {cart.note && (
                        <p className="text-xs text-muted-foreground mt-1 truncate">
                          {cart.note}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDate(cart.createdAt)} • {cart.items.length} items • ${cart.total.toLocaleString()}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        size="sm"
                        onClick={() => handleRecall(cart.id)}
                      >
                        Recall
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => handleDelete(cart.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
        
        <div className="flex justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
