import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProduct, useDeleteProduct } from "../hooks/products";
import { useBrands } from "../hooks/brands";
import { useCategories } from "../hooks/categories";
import { ProductStatusBadge, ImageGallery, VariantSelector, ProductVariantForm } from "../components/products";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { useToast } from "@/hooks/useToast";
import { Pencil, Trash2, ArrowLeft, Package, Tag, DollarSign } from "lucide-react";
import type { CreateVariantPayload, UpdateVariantPayload } from "../types/product";

export const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const productId = id ? parseInt(id) : 0;

  const { data: product, isLoading } = useProduct(productId);
  const { data: brands } = useBrands();
  const { data: categories } = useCategories();
  const deleteMutation = useDeleteProduct();

  const [showVariantForm, setShowVariantForm] = useState(false);
  const [selectedVariantId, setSelectedVariantId] = useState<number | undefined>();

  const brand = brands?.find(b => b.id === product?.brand_id);
  const category = categories?.find(c => c.id === product?.category_id);

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      deleteMutation.mutate(productId, {
        onSuccess: () => {
          toast({ title: "Success", description: "Product deleted" });
          navigate("/products");
        },
        onError: () => {
          toast({ title: "Error", description: "Failed to delete", variant: "destructive" });
        },
      });
    }
  };

  const handleCreateVariant = (data: CreateVariantPayload | Partial<CreateVariantPayload>) => {
    // API call to create variant would go here
    toast({ title: "Info", description: "Variant creation coming soon" });
    setShowVariantForm(false);
  };

  if (isLoading) return <div className="text-center py-8">Loading...</div>;
  if (!product) return <div className="text-center py-8">Product not found</div>;

  const stockColor = (product.stock || 0) < 10 ? 'text-red-600' : (product.stock || 0) < 20 ? 'text-yellow-600' : 'text-green-600';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/products")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">{product.name}</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(`/products/${productId}/edit`)}>
            <Pencil className="h-4 w-4 mr-2" /> Edit
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-2" /> Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Images</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageGallery
                images={product.images || []}
                productId={productId}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Variants</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">Manage product variants (sizes, colors, etc.)</p>
                <Button size="sm" onClick={() => setShowVariantForm(!showVariantForm)}>
                  Add Variant
                </Button>
              </div>
              
              {showVariantForm && (
                <ProductVariantForm
                  onSubmit={handleCreateVariant}
                  onCancel={() => setShowVariantForm(false)}
                />
              )}

              <VariantSelector
                variants={product.variants || []}
                selectedVariantId={selectedVariantId}
                onSelect={setSelectedVariantId}
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <Tag className="h-4 w-4" /> SKU
                </div>
                <p className="font-medium">{product.sku}</p>
              </div>

              <div>
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <Package className="h-4 w-4" /> Type
                </div>
                <Badge variant="outline" className="capitalize">{product.type}</Badge>
              </div>

              <div>
                <div className="flex items-center gap-2 text-gray-500 mb-1">Brand</div>
                <p>{brand?.name || "N/A"}</p>
              </div>

              <div>
                <div className="flex items-center gap-2 text-gray-500 mb-1">Category</div>
                <p>{category?.name || "N/A"}</p>
              </div>

              <div>
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <DollarSign className="h-4 w-4" /> Price
                </div>
                <p className="text-2xl font-bold">${(product.price || 0).toFixed(2)}</p>
                {product.cost_price && (
                  <p className="text-sm text-gray-500">Cost: ${product.cost_price.toFixed(2)}</p>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2 text-gray-500 mb-1">Stock Level</div>
                <p className={`text-2xl font-bold ${stockColor}`}>{product.stock || 0}</p>
                {product.low_stock_threshold && (
                  <p className="text-xs text-gray-500">Threshold: {product.low_stock_threshold}</p>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2 text-gray-500 mb-1">Status</div>
                <ProductStatusBadge status={product.status} />
              </div>

              {product.description && (
                <div>
                  <div className="flex items-center gap-2 text-gray-500 mb-1">Description</div>
                  <p className="text-sm">{product.description}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
