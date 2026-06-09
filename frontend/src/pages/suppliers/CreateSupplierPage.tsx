import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { SupplierForm } from "@/components/suppliers";
import { useCreateSupplier } from "@/hooks/useSuppliers";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import type { SupplierFormData } from "@/types/supplier";

export function CreateSupplierPage() {
  const navigate = useNavigate();
  const createMutation = useCreateSupplier();

  const handleSubmit = (data: SupplierFormData) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        toast.success("Supplier created successfully");
        navigate("/suppliers");
      },
      onError: () => {
        toast.error("Failed to create supplier");
      },
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Supplier"
        description="Add a new supplier to your system"
        actions={
          <Button variant="outline" onClick={() => navigate("/suppliers")}>
            Back to Suppliers
          </Button>
        }
      />

      <SupplierForm
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending}
      />
    </div>
  );
}
