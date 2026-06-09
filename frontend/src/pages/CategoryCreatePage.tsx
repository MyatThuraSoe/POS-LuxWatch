import { useNavigate } from "react-router-dom";
import { CategoryForm } from "../components/categories";
import { useCreateCategory } from "../hooks/categories";
import { useCategories } from "../hooks/categories";
import { useToast } from "@/hooks/useToast";
import type { CreateCategoryPayload } from "../types/category";

export const CategoryCreatePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const createMutation = useCreateCategory();
  const { data: categories } = useCategories();

  const handleSubmit = (data: CreateCategoryPayload) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        toast({ title: "Success", description: "Category created successfully" });
        navigate("/categories");
      },
      onError: () => {
        toast({ title: "Error", description: "Failed to create category", variant: "destructive" });
      },
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Create Category</h1>
      <CategoryForm
        categories={categories || []}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/categories")}
        isSubmitting={createMutation.isPending}
      />
    </div>
  );
};
