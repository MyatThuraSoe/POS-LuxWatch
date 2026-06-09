import React from 'react';
import { Grid } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { usePOSStore } from '@/stores/posStore';

interface ProductGridProps {
  products: Array<{
    id: number;
    name: string;
    price: number;
    stock: number;
    sku: string;
    category?: string;
  }>;
  onAddToCart: (product: { id: number; name: string; price: number; stock: number; sku: string; category?: string }) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products, onAddToCart }) => {
  const { searchQuery, selectedCategory } = usePOSStore();

  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  if (filteredProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
        <Grid className="h-12 w-12 mb-4 opacity-50" />
        <p className="text-lg font-medium">No products found</p>
        <p className="text-sm">Try adjusting your search or category filter</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-auto p-4">
      {filteredProducts.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
};
