import { useParams, useNavigate } from "react-router-dom";
import { BrandForm } from "../components/brands";
import { useBrand, useUpdateBrand } from "../hooks/brands";
import { useToast } from "@/hooks/useToast";
import type { UpdateBrandPayload } from "../types/product";

export const BrandEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const brandId = id ? parseInt(id) : 0;

  const { data: brand, isLoading } = useBrand(brandId);
  const updateMutation = useUpdateBrand();

  const handleSubmit = (data: UpdateBrandPayload) => {
    updateMutation.mutate({ id: brandId, ...data }, {
      onSuccess: () => {
        toast({ title: "Success", description: "Brand updated successfully" });
        navigate("/brands");
      },
      onError: () => {
        toast({ title: "Error", description: "Failed to update brand", variant: "destructive" });
      },
    });
  };

  if (isLoading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Edit Brand</h1>
      <BrandForm
        brand={brand}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/brands")}
        isSubmitting={updateMutation.isPending}
      />
    </div>
  );
};
