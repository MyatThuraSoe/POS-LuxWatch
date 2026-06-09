import { useNavigate } from "react-router-dom";
import { BrandForm } from "../components/brands";
import { useCreateBrand } from "../hooks/brands";
import { useToast } from "@/hooks/useToast";
import type { CreateBrandPayload } from "../types/brand";

export const BrandCreatePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const createMutation = useCreateBrand();

  const handleSubmit = (data: CreateBrandPayload | Partial<CreateBrandPayload>) => {
    createMutation.mutate(data as CreateBrandPayload, {
      onSuccess: () => {
        toast({ title: "Success", description: "Brand created successfully" });
        navigate("/brands");
      },
      onError: () => {
        toast({ title: "Error", description: "Failed to create brand", variant: "destructive" });
      },
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Create Brand</h1>
      <BrandForm
        onSubmit={handleSubmit}
        onCancel={() => navigate("/brands")}
        isSubmitting={createMutation.isPending}
      />
    </div>
  );
};
