import { useParams, useNavigate } from "react-router-dom";
import { CategoryForm } from "../components/categories";
import { useCategory, useUpdateCategory } from "../hooks/categories";
import { useCategories } from "../hooks/categories";
import { useToast } from "@/hooks/useToast";
import type { UpdateCategoryPayload } from "../types/product";

export const CategoryEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const categoryId = id ? parseInt(id) : 0;

  const { data: category, isLoading } = useCategory(categoryId);
  const updateMutation = useUpdateCategory();
  const { data: categories } = useCategories();

  const handleSubmit = (data: UpdateCategoryPayload) => {
    updateMutation.mutate({ id: categoryId, data }, {
      onSuccess: () => {
        toast({ title: "Success", description: "Category updated successfully" });
        navigate("/categories");
      },
      onError: () => {
        toast({ title: "Error", description: "Failed to update category", variant: "destructive" });
      },
    });
  };

  if (isLoading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Edit Category</h1>
      <CategoryForm
        category={category}
        categories={categories || []}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/categories")}
        isSubmitting={updateMutation.isPending}
      />
    </div>
  );
};
