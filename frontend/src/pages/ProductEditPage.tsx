import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ProductForm } from "../components/products";
import { useProduct, useUpdateProduct } from "../hooks/products";
import { useBrands } from "../hooks/brands";
import { useCategories } from "../hooks/categories";
import { useToast } from "@/hooks/useToast";
import type { UpdateProductPayload } from "../types/product";

export const ProductEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const productId = id ? parseInt(id) : 0;
  
  const { data: product, isLoading } = useProduct(productId);
  const updateMutation = useUpdateProduct();
  const { data: brands } = useBrands();
  const { data: categories } = useCategories();

  const handleSubmit = (data: UpdateProductPayload) => {
    updateMutation.mutate({ id: productId, data }, {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Product updated successfully",
        });
        navigate(`/products/${productId}`);
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to update product",
          variant: "destructive",
        });
      },
    });
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading product...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Edit Product</h1>
      </div>
      <ProductForm
        product={product}
        brands={brands || []}
        categories={categories || []}
        onSubmit={handleSubmit}
        onCancel={() => navigate(`/products/${productId}`)}
        isSubmitting={updateMutation.isPending}
      />
    </div>
  );
};
