import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCategoryTree, useCreateCategory, useDeleteCategory } from "../hooks/categories";
import { CategoryTree, CategoryForm } from "../components/categories";
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui";
import type { CategoryTreeNode } from "../types/product";

export const CategoriesPage = () => {
  const navigate = useNavigate();
  const { data: categories, isLoading } = useCategoryTree();
  const createMutation = useCreateCategory();
  const deleteMutation = useDeleteCategory();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryTreeNode | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CategoryTreeNode | null>(null);

  const handleCreate = (data: any) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        setIsCreateModalOpen(false);
      },
    });
  };

  const handleEdit = (category: CategoryTreeNode) => {
    setEditingCategory(category);
  };

  const handleDelete = (category: CategoryTreeNode) => {
    if (window.confirm(`Are you sure you want to delete "${category.name}"?`)) {
      deleteMutation.mutate(category.id);
    }
  };

  const handleUpdate = (data: any) => {
    // Update logic would go here
    setEditingCategory(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Categories</h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>Create Category</Button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading categories...</div>
      ) : (
        <CategoryTree
          categories={categories || []}
          onSelect={setSelectedCategory}
          onEdit={handleEdit}
          onDelete={handleDelete}
          selectedId={selectedCategory?.id || null}
          editable
        />
      )}

      {/* Create Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Category</DialogTitle>
          </DialogHeader>
          <CategoryForm
            onSubmit={handleCreate}
            onCancel={() => setIsCreateModalOpen(false)}
            categories={categories as any}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      {editingCategory && (
        <Dialog open={!!editingCategory} onOpenChange={() => setEditingCategory(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Category</DialogTitle>
            </DialogHeader>
            <CategoryForm
              category={editingCategory}
              onSubmit={handleUpdate}
              onCancel={() => setEditingCategory(null)}
              isEditing
              categories={categories as any}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
