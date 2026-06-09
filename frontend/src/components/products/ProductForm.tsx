import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useCreateProduct } from "../../hooks/products";
import { useBrands } from "../../hooks/brands";
import { useCategories } from "../../hooks/categories";
import { Button, Input, Label, Select, Textarea, Card, CardContent, CardHeader } from "../ui";
import { TypeSpecificFields } from "./TypeSpecificFields";
import type { CreateProductPayload, ProductType } from "../../types/product";

interface ProductFormProps {
  onSubmit: (data: CreateProductPayload) => void;
  onCancel: () => void;
  defaultValues?: Partial<CreateProductPayload>;
  brands?: any[];
  categories?: any[];
  product?: any;
  isSubmitting?: boolean;
}

export const ProductForm = ({ onSubmit, onCancel, defaultValues }: ProductFormProps) => {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<CreateProductPayload>({
    defaultValues: {
      name: "",
      description: "",
      type: "classic",
      brand_id: null,
      category_id: null,
      base_price: 0,
      cost_price: 0,
      tax_rate: 0,
      track_inventory: true,
      low_stock_threshold: 10,
      ...defaultValues,
    },
  });

  const { data: brands } = useBrands();
  const { data: categories } = useCategories();
  const productType = watch("type");

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValue("type", e.target.value as ProductType);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Basic Information</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Product Name *</Label>
            <Input
              id="name"
              {...register("name", { required: "Product name is required", minLength: { value: 2, message: "Name must be at least 2 characters" } })}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register("description")}
              rows={3}
              className="resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Product Type *</Label>
              <Select
                id="type"
                {...register("type", { required: "Product type is required" })}
                onChange={handleTypeChange}
                className={errors.type ? "border-red-500" : ""}
              >
                <option value="classic">Classic Watch</option>
                <option value="smart">Smart Watch</option>
              </Select>
              {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>}
            </div>

            <div>
              <Label htmlFor="is_active">Status</Label>
              <select
                id="is_active"
                {...register("is_active")}
                defaultValue="true"
                className="w-full p-2 border rounded-md"
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="brand_id">Brand</Label>
              <Select id="brand_id" {...register("brand_id", { valueAsNumber: true })}>
                <option value="">Select Brand</option>
                {brands?.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <Label htmlFor="category_id">Category</Label>
              <Select id="category_id" {...register("category_id", { valueAsNumber: true })}>
                <option value="">Select Category</option>
                {categories?.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pricing */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Pricing</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="base_price">Base Price *</Label>
              <Input
                id="base_price"
                type="number"
                step="0.01"
                min="0"
                {...register("base_price", { required: "Base price is required", min: { value: 0, message: "Price must be positive" } })}
                className={errors.base_price ? "border-red-500" : ""}
              />
              {errors.base_price && <p className="text-red-500 text-sm mt-1">{errors.base_price.message}</p>}
            </div>

            <div>
              <Label htmlFor="cost_price">Cost Price</Label>
              <Input
                id="cost_price"
                type="number"
                step="0.01"
                min="0"
                {...register("cost_price", { valueAsNumber: true, min: { value: 0, message: "Cost must be positive" } })}
              />
            </div>

            <div>
              <Label htmlFor="tax_rate">Tax Rate (%)</Label>
              <Input
                id="tax_rate"
                type="number"
                step="0.1"
                min="0"
                max="100"
                {...register("tax_rate", { valueAsNumber: true, min: { value: 0, message: "Tax must be 0-100" }, max: { value: 100, message: "Tax must be 0-100" } })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Type-Specific Fields */}
      <TypeSpecificFields productType={productType} register={register} errors={errors} />

      {/* Inventory Settings */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Inventory Settings</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="track_inventory"
              {...register("track_inventory")}
              className="rounded border-gray-300"
            />
            <Label htmlFor="track_inventory">Track Inventory</Label>
          </div>

          {watch("track_inventory") && (
            <div>
              <Label htmlFor="low_stock_threshold">Low Stock Threshold</Label>
              <Input
                id="low_stock_threshold"
                type="number"
                min="0"
                {...register("low_stock_threshold", { valueAsNumber: true, min: { value: 0, message: "Must be non-negative" } })}
              />
            </div>
          )}

          <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
            <p className="text-sm text-yellow-800">
              Note: After creating the product, you can add variants with different SKUs, prices, and quantities on the variants management page.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Create Product</Button>
      </div>
    </form>
  );
};
