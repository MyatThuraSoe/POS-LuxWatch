import { useNavigate } from "react-router-dom";
import { ProductForm } from "../components/products";
import { useCreateProduct } from "../hooks/products";
import { useBrands } from "../hooks/brands";
import { useCategories } from "../hooks/categories";
import { useToast } from "@/hooks/useToast";
import type { CreateProductPayload } from "../types/product";

export const ProductCreatePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const createMutation = useCreateProduct();
  const { data: brands } = useBrands();
  const { data: categories } = useCategories();

  const handleSubmit = (data: CreateProductPayload) => {
    createMutation.mutate(data, {
      onSuccess: (product) => {
        toast({
          title: "Success",
          description: "Product created successfully",
        });
        navigate(`/products/${product.id}`);
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to create product",
          variant: "destructive",
        });
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Create Product</h1>
      </div>
      <ProductForm
        brands={brands || []}
        categories={categories || []}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/products")}
        isSubmitting={createMutation.isPending}
      />
    </div>
  );
};
