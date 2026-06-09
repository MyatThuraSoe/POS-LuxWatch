import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProducts, useDeleteProduct } from "../hooks/products";
import { useBrands } from "../hooks/brands";
import { useCategories } from "../hooks/categories";
import { ProductFilters, ProductTable, ProductCard, BulkActionToolbar, ProductQuickView } from "../components/products";
import { Button } from "../components/ui/button";
import { useToast } from "@/hooks/useToast";
import type { ProductFilters as ProductFiltersType, Product } from "../types/product";
import { LayoutGrid, List } from "lucide-react";

export const ProductsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [filters, setFilters] = useState<ProductFiltersType>({});
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const perPage = 20;
  
  const { data: productsData, isLoading } = useProducts({ ...filters, page, per_page: perPage });
  const { data: brands } = useBrands();
  const { data: categories } = useCategories();
  const deleteMutation = useDeleteProduct();

  const products = productsData?.data || [];
  const pagination = productsData?.meta || {};

  const handleFilterChange = (newFilters: ProductFiltersType) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleReset = () => {
    setFilters({});
    setPage(1);
  };

  const handleDelete = (id: number) => {
    if (window.confirm(`Are you sure you want to delete this product?`)) {
      deleteMutation.mutate(id, {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Product deleted successfully",
          });
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Failed to delete product",
            variant: "destructive",
          });
        },
      });
    }
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedProducts.length} selected products?`)) {
      Promise.all(selectedProducts.map(id => deleteMutation.mutateAsync(id)))
        .then(() => {
          toast({
            title: "Success",
            description: `${selectedProducts.length} products deleted`,
          });
          setSelectedProducts([]);
        })
        .catch(() => {
          toast({
            title: "Error",
            description: "Failed to delete some products",
            variant: "destructive",
          });
        });
    }
  };

  const handleSelectionChange = (ids: number[]) => {
    setSelectedProducts(ids);
  };

  const handleView = (id: number) => {
    const product = products.find((p: Product) => p.id === id);
    if (product) {
      setQuickViewProduct(product);
      setIsQuickViewOpen(true);
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/products/${id}/edit`);
  };

  const getBrandName = (brandId?: number | null) => brandId ? brands?.find(b => b.id === brandId)?.name : undefined;
  const getCategoryName = (categoryId?: number | null) => categoryId ? categories?.find(c => c.id === categoryId)?.name : undefined;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Products</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setViewMode('table')}
            className={viewMode === 'table' ? 'bg-gray-100' : ''}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setViewMode('grid')}
            className={viewMode === 'grid' ? 'bg-gray-100' : ''}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button onClick={() => navigate('/products/create')}>Create Product</Button>
        </div>
      </div>

      <ProductFilters
        brands={brands}
        categories={categories}
        onFilterChange={handleFilterChange}
        onReset={handleReset}
      />

      {selectedProducts.length > 0 && (
        <BulkActionToolbar
          selectedCount={selectedProducts.length}
          onBulkDelete={handleBulkDelete}
          onExport={() => toast({ title: "Info", description: "Export functionality coming soon" })}
        />
      )}

      {isLoading ? (
        <div className="text-center py-8">Loading products...</div>
      ) : (
        <>
          {viewMode === 'table' ? (
            <ProductTable
              products={products}
              brands={brands || []}
              categories={categories || []}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onView={handleView}
              selectedProducts={selectedProducts}
              onSelectionChange={handleSelectionChange}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map((product: Product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  brandName={getBrandName(product.brand_id)}
                  categoryName={getCategoryName(product.category_id)}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onView={handleView}
                />
              ))}
            </div>
          )}

          {pagination.total > perPage && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">
                Showing {(pagination.current_page - 1) * perPage + 1} to{" "}
                {Math.min(pagination.current_page * perPage, pagination.total)} of {pagination.total} products
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.current_page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.current_page === pagination.last_page}
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      <ProductQuickView
        product={quickViewProduct}
        brands={brands || []}
        categories={categories || []}
        open={isQuickViewOpen}
        onOpenChange={setIsQuickViewOpen}
        onEdit={() => {
          if (quickViewProduct) {
            navigate(`/products/${quickViewProduct.id}/edit`);
            setIsQuickViewOpen(false);
          }
        }}
      />
    </div>
  );
};
