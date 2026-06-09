import { useState } from "react";
import { Input, Button, Select } from "../ui";
import type { ProductFilters, ProductType, ProductStatus } from "../../types/product";
import type { Brand } from "../../types/product";
import type { Category } from "../../types/product";

interface ProductFiltersProps {
  brands?: Brand[];
  categories?: Category[];
  onFilterChange: (filters: ProductFilters) => void;
  onReset: () => void;
}

export const ProductFiltersComponent = ({
  brands,
  categories,
  onFilterChange,
  onReset,
}: ProductFiltersProps) => {
  const [filters, setFilters] = useState<ProductFilters>({
    search: "",
    brand_id: null,
    category_id: null,
    type: null,
    status: null,
    min_price: null,
    max_price: null,
    in_stock: null,
    low_stock: null,
  });

  const handleChange = (key: keyof ProductFilters, value: unknown) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const emptyFilters: ProductFilters = {
      search: "",
      brand_id: null,
      category_id: null,
      type: null,
      status: null,
      min_price: null,
      max_price: null,
      in_stock: null,
      low_stock: null,
    };
    setFilters(emptyFilters);
    onReset();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-white rounded-lg shadow-sm border">
      <div>
        <label className="block text-sm font-medium mb-1">Search</label>
        <Input
          type="text"
          placeholder="Search products..."
          value={filters.search || ""}
          onChange={(e) => handleChange("search", e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Brand</label>
        <Select
          value={filters.brand_id?.toString() || ""}
          onChange={(e) => handleChange("brand_id", e.target.value ? Number(e.target.value) : null)}
        >
          <option value="">All Brands</option>
          {brands?.map((brand) => (
            <option key={brand.id} value={brand.id}>
              {brand.name}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Category</label>
        <Select
          value={filters.category_id?.toString() || ""}
          onChange={(e) => handleChange("category_id", e.target.value ? Number(e.target.value) : null)}
        >
          <option value="">All Categories</option>
          {categories?.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Type</label>
        <Select
          value={filters.type || ""}
          onChange={(e) => handleChange("type", e.target.value as ProductType | null)}
        >
          <option value="">All Types</option>
          <option value="classic">Classic</option>
          <option value="smart">Smart</option>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Status</label>
        <Select
          value={filters.status || ""}
          onChange={(e) => handleChange("status", e.target.value as ProductStatus | null)}
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Min Price</label>
        <Input
          type="number"
          placeholder="0"
          value={filters.min_price?.toString() || ""}
          onChange={(e) => handleChange("min_price", e.target.value ? Number(e.target.value) : null)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Max Price</label>
        <Input
          type="number"
          placeholder="9999"
          value={filters.max_price?.toString() || ""}
          onChange={(e) => handleChange("max_price", e.target.value ? Number(e.target.value) : null)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Stock Status</label>
        <Select
          value={filters.in_stock === null ? "" : filters.in_stock ? "in_stock" : "out_of_stock"}
          onChange={(e) => {
            const val = e.target.value;
            handleChange("in_stock", val === "" ? null : val === "in_stock");
          }}
        >
          <option value="">All</option>
          <option value="in_stock">In Stock</option>
          <option value="out_of_stock">Out of Stock</option>
        </Select>
      </div>

      <div className="flex items-end">
        <Button variant="outline" onClick={handleReset} className="w-full">
          Reset Filters
        </Button>
      </div>
    </div>
  );
};
