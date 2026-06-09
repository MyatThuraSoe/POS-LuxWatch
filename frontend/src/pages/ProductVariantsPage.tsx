import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProduct, useProductVariants, useCreateVariant, useUpdateVariant, useDeleteVariant } from "../hooks/products";
import { ProductVariantForm, VariantSelector } from "../components/products";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { useToast } from "@/hooks/useToast";
import { ArrowLeft, Plus, Pencil, Trash2 } from "lucide-react";
import type { CreateVariantPayload, UpdateVariantPayload } from "../types/product";

export const ProductVariantsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const productId = id ? parseInt(id) : 0;

  const { data: product, isLoading: productLoading } = useProduct(productId);
  const { data: variants, isLoading: variantsLoading } = useProductVariants(productId);
  const createMutation = useCreateVariant(productId);
  const updateMutation = useUpdateVariant(productId, 0);
  const deleteMutation = useDeleteVariant(productId);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingVariantId, setEditingVariantId] = useState<number | null>(null);

  const handleCreateVariant = (data: CreateVariantPayload | Partial<CreateVariantPayload>) => {
    createMutation.mutate(data as CreateVariantPayload, {
      onSuccess: () => {
        toast({ title: "Success", description: "Variant created successfully" });
        setShowCreateForm(false);
      },
      onError: () => {
        toast({ title: "Error", description: "Failed to create variant", variant: "destructive" });
      },
    });
  };

  const handleUpdateVariant = (variantId: number, data: UpdateVariantPayload) => {
    updateMutation.mutate(data, {
      onSuccess: () => {
        toast({ title: "Success", description: "Variant updated successfully" });
        setEditingVariantId(null);
      },
      onError: () => {
        toast({ title: "Error", description: "Failed to update variant", variant: "destructive" });
      },
    });
  };

  const handleDeleteVariant = (variantId: number) => {
    if (window.confirm("Are you sure you want to delete this variant?")) {
      deleteMutation.mutate(variantId, {
        onSuccess: () => {
          toast({ title: "Success", description: "Variant deleted successfully" });
        },
        onError: () => {
          toast({ title: "Error", description: "Failed to delete variant", variant: "destructive" });
        },
      });
    }
  };

  if (productLoading || variantsLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!product) {
    return <div className="text-center py-8">Product not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(`/products/${productId}`)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Manage Variants</h1>
            <p className="text-sm text-gray-500">{product.name}</p>
          </div>
        </div>
        <Button onClick={() => setShowCreateForm(!showCreateForm)}>
          <Plus className="h-4 w-4 mr-2" />
          {showCreateForm ? "Cancel" : "Add Variant"}
        </Button>
      </div>

      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Variant</CardTitle>
          </CardHeader>
          <CardContent>
            <ProductVariantForm
              onSubmit={handleCreateVariant}
              onCancel={() => setShowCreateForm(false)}
            />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Existing Variants ({variants?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {variants && variants.length > 0 ? (
            <div className="space-y-4">
              {variants.map((variant) => (
                <div key={variant.id} className="border rounded-lg p-4 space-y-3">
                  {editingVariantId === variant.id ? (
                    <ProductVariantForm
                      initialData={variant}
                      onSubmit={(data) => handleUpdateVariant(variant.id, data)}
                      onCancel={() => setEditingVariantId(null)}
                    />
                  ) : (
                    <>
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{variant.sku}</h3>
                            <Badge variant={variant.is_active ? "default" : "secondary"}>
                              {variant.is_active ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(variant.attributes).map(([key, value]) => (
                              <Badge key={key} variant="outline" className="capitalize">
                                {key}: {value}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingVariantId(variant.id)}
                          >
                            <Pencil className="h-3 w-3 mr-1" /> Edit
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDeleteVariant(variant.id)}
                          >
                            <Trash2 className="h-3 w-3 mr-1" /> Delete
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Price:</span>
                          <span className="ml-2 font-medium">${variant.price.toFixed(2)}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Cost:</span>
                          <span className="ml-2 font-medium">
                            ${variant.cost_price?.toFixed(2) || "N/A"}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Stock:</span>
                          <span className={`ml-2 font-medium ${(variant.stock || 0) < 10 ? 'text-red-600' : ''}`}>
                            {variant.stock || 0}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Position:</span>
                          <span className="ml-2 font-medium">{variant.position}</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No variants found. Click "Add Variant" to create one.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
