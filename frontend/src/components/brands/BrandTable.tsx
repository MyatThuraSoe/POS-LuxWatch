import { useState } from "react";
import { Input, Button, Table, Badge } from "../ui";
import type { Brand } from "../../types/product";

interface BrandTableProps {
  brands: Brand[];
  onEdit: (brand: Brand) => void;
  onDelete: (brand: Brand) => void;
  isLoading?: boolean;
}

export const BrandTable = ({
  brands,
  onEdit,
  onDelete,
  isLoading = false,
}: BrandTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredBrands = brands.filter(
    (brand) =>
      brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      brand.country?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <div className="text-center py-8">Loading brands...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Input
          type="text"
          placeholder="Search brands..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xs"
        />
      </div>

      <div className="overflow-x-auto">
        <Table>
          <thead>
            <tr className="border-b">
              <th className="text-left p-3">Logo</th>
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Country</th>
              <th className="text-left p-3">Products</th>
              <th className="text-left p-3">Status</th>
              <th className="text-right p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBrands.map((brand) => (
              <tr key={brand.id} className="border-b hover:bg-gray-50">
                <td className="p-3">
                  {brand.logo_url ? (
                    <img src={brand.logo_url} alt={brand.name} className="h-10 w-auto object-contain" />
                  ) : (
                    <div className="h-10 w-10 bg-gray-200 rounded flex items-center justify-center">
                      {brand.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </td>
                <td className="p-3 font-medium">{brand.name}</td>
                <td className="p-3">{brand.country || "-"}</td>
                <td className="p-3">{brand.product_count || 0}</td>
                <td className="p-3">
                  <Badge variant={brand.is_active ? "success" : "default"}>
                    {brand.is_active ? "Active" : "Inactive"}
                  </Badge>
                </td>
                <td className="p-3 text-right">
                  <Button size="sm" variant="outline" onClick={() => onEdit(brand)} className="mr-2">
                    Edit
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => onDelete(brand)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
            {filteredBrands.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center p-8 text-gray-500">
                  No brands found
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </div>
  );
};
