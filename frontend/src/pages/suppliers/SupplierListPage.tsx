import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/common/PageHeader";
import { SupplierTable } from "@/components/suppliers";
import { Button } from "@/components/ui/button";
import { useSuppliers, useDeleteSupplier } from "@/hooks/useSuppliers";
import type { Supplier } from "@/types/supplier";
import { toast } from "sonner";

export function SupplierListPage() {
  const navigate = useNavigate();
  const [filters] = useState<Record<string, unknown>>({});

  const { data: suppliersData, isLoading } = useSuppliers(filters);
  const deleteMutation = useDeleteSupplier();

  const handleView = (supplier: Supplier) => {
    navigate(`/suppliers/${supplier.id}`);
  };

  const handleEdit = (supplier: Supplier) => {
    navigate(`/suppliers/${supplier.id}/edit`);
  };

  const handleDelete = (supplier: Supplier) => {
    if (confirm(`Are you sure you want to delete ${supplier.name}?`)) {
      deleteMutation.mutate(supplier.id, {
        onSuccess: () => {
          toast.success("Supplier deleted successfully");
        },
        onError: () => {
          toast.error("Failed to delete supplier");
        },
      });
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Suppliers"
        description="Manage your suppliers and contacts"
      >
        <Button onClick={() => navigate("/suppliers/create")}>
          Add Supplier
        </Button>
      </PageHeader>

      <SupplierTable
        suppliers={suppliersData?.data || []}
        isLoading={isLoading}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
