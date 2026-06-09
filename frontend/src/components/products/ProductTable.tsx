import { useState } from 'react';
import type { Product, Brand, Category } from '@/types/product';
import { ProductStatusBadge } from './ProductStatusBadge';
import { Pencil, Trash2, Eye, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';

interface ProductTableProps {
  products: Product[];
  brands: Brand[];
  categories: Category[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onView: (id: number) => void;
  selectedProducts: number[];
  onSelectionChange: (ids: number[]) => void;
}

export function ProductTable({
  products,
  brands,
  categories,
  onEdit,
  onDelete,
  onView,
  selectedProducts,
  onSelectionChange,
}: ProductTableProps) {
  const [sortField, setSortField] = useState<keyof Product>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const getBrandName = (brandId?: number) =>
    brands.find((b) => b.id === brandId)?.name || 'N/A';

  const getCategoryName = (categoryId?: number) =>
    categories.find((c) => c.id === categoryId)?.name || 'N/A';

  const handleSort = (field: keyof Product) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedProducts = [...products].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];
    if (aVal == null && bVal == null) return 0;
    if (aVal == null) return sortDirection === 'asc' ? 1 : -1;
    if (bVal == null) return sortDirection === 'asc' ? -1 : 1;
    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const toggleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(products.map(p => p.id));
    }
  };

  const toggleSelect = (id: number) => {
    if (selectedProducts.includes(id)) {
      onSelectionChange(selectedProducts.filter(pid => pid !== id));
    } else {
      onSelectionChange([...selectedProducts, id]);
    }
  };

  return (
    <div className="rounded-md border">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="text-left p-3 w-10">
                <Checkbox
                  checked={selectedProducts.length === products.length && products.length > 0}
                  onCheckedChange={toggleSelectAll}
                />
              </th>
              <th className="text-left p-3 cursor-pointer" onClick={() => handleSort('name')}>
                Name <ArrowUpDown className="inline h-4 w-4 ml-1" />
              </th>
              <th className="text-left p-3">Brand</th>
              <th className="text-left p-3">Category</th>
              <th className="text-left p-3">Type</th>
              <th className="text-left p-3 cursor-pointer" onClick={() => handleSort('base_price')}>
                Price <ArrowUpDown className="inline h-4 w-4 ml-1" />
              </th>
              <th className="text-left p-3">Stock</th>
              <th className="text-left p-3">Status</th>
              <th className="text-right p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedProducts.map((product) => {
              const stockColor =
                product.total_quantity < 10
                  ? 'text-red-600'
                  : product.total_quantity < 20
                  ? 'text-yellow-600'
                  : 'text-green-600';

              return (
                <tr key={product.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <Checkbox
                      checked={selectedProducts.includes(product.id)}
                      onCheckedChange={() => toggleSelect(product.id)}
                    />
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      {product.images?.[0]?.url ? (
                        <img
                          src={product.images[0].url}
                          alt={product.name}
                          className="h-10 w-10 object-cover rounded-md"
                        />
                      ) : (
                        <div className="h-10 w-10 bg-gray-100 rounded-md flex items-center justify-center">
                          <span className="text-xs text-gray-500">No Img</span>
                        </div>
                      )}
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-xs text-gray-500">SKU: {product.variants?.[0]?.sku || 'N/A'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3">{getBrandName(product.brand_id ?? undefined)}</td>
                  <td className="p-3">{getCategoryName(product.category_id ?? undefined)}</td>
                  <td className="p-3">
                    <Badge variant="outline" className="capitalize">
                      {product.type}
                    </Badge>
                  </td>
                  <td className="p-3">${product.base_price.toFixed(2)}</td>
                  <td className="p-3">
                    <span className={`font-medium ${stockColor}`}>{product.total_quantity}</span>
                  </td>
                  <td className="p-3">
                    <ProductStatusBadge status={product.status} />
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => onView(product.id)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => onEdit(product.id)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(product.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {products.length === 0 && (
              <tr>
                <td colSpan={9} className="text-center p-8 text-gray-500">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
