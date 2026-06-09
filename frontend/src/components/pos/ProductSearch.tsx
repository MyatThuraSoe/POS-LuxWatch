import React from 'react';
import { Search, Barcode } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { usePOSStore } from '@/stores/posStore';
import { useDebounce } from '@/hooks/useDebounce';

interface ProductSearchProps {
  onProductSelect?: (productId: number) => void;
  onBarcodeScan?: (sku: string) => void;
}

export const ProductSearch: React.FC<ProductSearchProps> = ({ 
  onProductSelect,
  onBarcodeScan 
}) => {
  const { searchQuery, setSearchQuery, selectedCategory, setSelectedCategory } = usePOSStore();
  const debouncedSearch = useDebounce(searchQuery, 300);

  const handleBarcodeKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const sku = e.currentTarget.value.trim();
      if (sku && onBarcodeScan) {
        onBarcodeScan(sku);
        e.currentTarget.value = '';
      }
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products by name or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="relative w-48">
          <Barcode className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Scan barcode"
            onKeyDown={handleBarcodeKeyDown}
            className="pl-8"
            autoFocus
          />
        </div>
      </div>
      
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={selectedCategory === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedCategory('all')}
        >
          All
        </Button>
        <Button
          variant={selectedCategory === 'Classic' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedCategory('Classic')}
        >
          Classic
        </Button>
        <Button
          variant={selectedCategory === 'Smart' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedCategory('Smart')}
        >
          Smart
        </Button>
      </div>
    </div>
  );
};
