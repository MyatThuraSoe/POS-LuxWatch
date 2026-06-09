import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle, Printer, Download } from 'lucide-react';
import type { SaleCompleteData } from '@/types/pos';

interface SaleCompleteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  saleData: SaleCompleteData | null;
  onPrintReceipt: () => void;
  onNewSale: () => void;
}

export const SaleCompleteModal: React.FC<SaleCompleteModalProps> = ({
  open,
  onOpenChange,
  saleData,
  onPrintReceipt,
  onNewSale
}) => {
  if (!saleData) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-6 w-6" />
            Sale Completed!
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-6 space-y-4">
          {/* Success Animation */}
          <div className="flex justify-center">
            <div className="relative">
              <CheckCircle className="h-24 w-24 text-green-500 animate-bounce" />
              <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping" />
            </div>
          </div>
          
          {/* Sale Details */}
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">Receipt Number</p>
            <p className="text-2xl font-bold">{saleData.receiptNumber}</p>
            
            <div className="pt-4">
              <p className="text-sm text-muted-foreground">Total Amount</p>
              <p className="text-3xl font-bold text-primary">
                ${saleData.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </div>
            
            {saleData.change !== undefined && saleData.change > 0 && (
              <div className="pt-2">
                <p className="text-sm text-muted-foreground">Change</p>
                <p className="text-xl font-semibold text-green-600">
                  ${saleData.change.toFixed(2)}
                </p>
              </div>
            )}
            
            <p className="text-xs text-muted-foreground pt-2">
              {new Date(saleData.timestamp).toLocaleString()}
            </p>
          </div>
        </div>
        
        {/* Actions */}
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" onClick={onPrintReceipt}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button variant="outline" onClick={() => {}}>
            <Download className="mr-2 h-4 w-4" />
            PDF
          </Button>
        </div>
        
        <Button 
          className="w-full bg-green-600 hover:bg-green-700" 
          onClick={onNewSale}
        >
          New Sale
        </Button>
      </DialogContent>
    </Dialog>
  );
};
