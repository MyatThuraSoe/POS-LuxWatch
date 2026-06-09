import { useState } from "react";
import { useBrands, useCreateBrand, useUpdateBrand, useDeleteBrand } from "../hooks/brands";
import { BrandTable, BrandForm } from "../components/brands";
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui";
import type { Brand } from "../types/product";

export const BrandsPage = () => {
  const { data: brands, isLoading } = useBrands();
  const createMutation = useCreateBrand();
  const updateMutation = useUpdateBrand();
  const deleteMutation = useDeleteBrand();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);

  const handleCreate = (data: any) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        setIsCreateModalOpen(false);
      },
    });
  };

  const handleEdit = (brand: Brand) => {
    setEditingBrand(brand);
  };

  const handleDelete = (brand: Brand) => {
    if (window.confirm(`Are you sure you want to delete "${brand.name}"?`)) {
      deleteMutation.mutate(brand.id);
    }
  };

  const handleUpdate = (data: any) => {
    if (editingBrand) {
      updateMutation.mutate({ id: editingBrand.id, ...data }, {
        onSuccess: () => {
          setEditingBrand(null);
        },
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Brands</h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>Create Brand</Button>
      </div>

      <BrandTable brands={brands || []} onEdit={handleEdit} onDelete={handleDelete} isLoading={isLoading} />

      {/* Create Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Brand</DialogTitle>
          </DialogHeader>
          <BrandForm onSubmit={handleCreate} onCancel={() => setIsCreateModalOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      {editingBrand && (
        <Dialog open={!!editingBrand} onOpenChange={() => setEditingBrand(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Brand</DialogTitle>
            </DialogHeader>
            <BrandForm brand={editingBrand} onSubmit={handleUpdate} onCancel={() => setEditingBrand(null)} isEditing />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
