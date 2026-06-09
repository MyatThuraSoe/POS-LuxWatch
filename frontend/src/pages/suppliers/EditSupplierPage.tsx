import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/common/PageHeader";
import { SupplierForm } from "@/components/suppliers";
import { useSupplier, useUpdateSupplier } from "@/hooks/useSuppliers";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { SupplierFormData } from "@/types/supplier";

export function EditSupplierPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const supplierId = id ? parseInt(id) : 0;
  
  const { data: supplier, isLoading } = useSupplier(supplierId);
  const updateMutation = useUpdateSupplier();

  const handleSubmit = (data: SupplierFormData) => {
    updateMutation.mutate({ id: supplierId, data }, {
      onSuccess: () => {
        toast.success("Supplier updated successfully");
        navigate(`/suppliers/${supplierId}`);
      },
      onError: () => {
        toast.error("Failed to update supplier");
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Loading supplier details...</p>
      </div>
    );
  }

  if (!supplier) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Supplier not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Supplier"
        description={`Editing: ${supplier.name}`}
        actions={
          <Button variant="outline" onClick={() => navigate(`/suppliers/${supplierId}`)}>
            Back to Details
          </Button>
        }
      />

      <SupplierForm
        supplier={supplier}
        onSubmit={handleSubmit}
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}
