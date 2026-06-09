import { useState } from "react";
import { Input, Button, Label, Select, Card, CardContent } from "../ui";
import type { ProductVariant, CreateVariantPayload, UpdateVariantPayload } from "../../types/product";

interface ProductVariantFormProps {
  variant?: ProductVariant;
  initialData?: ProductVariant;
  onSubmit: (data: CreateVariantPayload | UpdateVariantPayload) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

export const ProductVariantForm = ({
  variant,
  onSubmit,
  onCancel,
  isEditing = false,
}: ProductVariantFormProps) => {
  const [formData, setFormData] = useState<CreateVariantPayload>({
    sku: variant?.sku || "",
    name: variant?.name || "",
    attributes: variant?.attributes || {},
    price: variant?.price || 0,
    cost_price: variant?.cost_price || undefined,
    quantity: variant?.quantity || 0,
    low_stock_threshold: variant?.low_stock_threshold || undefined,
    is_default: variant?.is_default || false,
  });

  const [attributeKey, setAttributeKey] = useState("");
  const [attributeValue, setAttributeValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleAddAttribute = () => {
    if (attributeKey && attributeValue) {
      setFormData({
        ...formData,
        attributes: {
          ...formData.attributes,
          [attributeKey]: attributeValue,
        },
      });
      setAttributeKey("");
      setAttributeValue("");
    }
  };

  const handleRemoveAttribute = (key: string) => {
    const newAttributes = { ...formData.attributes };
    delete newAttributes[key];
    setFormData({ ...formData, attributes: newAttributes });
  };

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                type="text"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="name">Variant Name</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                required
              />
            </div>

            <div>
              <Label htmlFor="cost_price">Cost Price</Label>
              <Input
                id="cost_price"
                type="number"
                step="0.01"
                value={formData.cost_price?.toString() || ""}
                onChange={(e) =>
                  setFormData({ ...formData, cost_price: e.target.value ? Number(e.target.value) : undefined })
                }
              />
            </div>

            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                required
              />
            </div>

            <div>
              <Label htmlFor="low_stock_threshold">Low Stock Threshold</Label>
              <Input
                id="low_stock_threshold"
                type="number"
                value={formData.low_stock_threshold?.toString() || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    low_stock_threshold: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_default"
                checked={formData.is_default}
                onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
              />
              <Label htmlFor="is_default">Default Variant</Label>
            </div>
          </div>

          {/* Attributes Section */}
          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">Attributes (e.g., Color, Size)</h4>
            <div className="flex gap-2 mb-2">
              <Input
                placeholder="Attribute name (e.g., Color)"
                value={attributeKey}
                onChange={(e) => setAttributeKey(e.target.value)}
              />
              <Input
                placeholder="Value (e.g., Red)"
                value={attributeValue}
                onChange={(e) => setAttributeValue(e.target.value)}
              />
              <Button type="button" onClick={handleAddAttribute}>
                Add
              </Button>
            </div>

            {Object.entries(formData.attributes).length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {Object.entries(formData.attributes).map(([key, value]) => (
                  <span
                    key={key}
                    className="inline-flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full text-sm"
                  >
                    {key}: {value}
                    <button
                      type="button"
                      onClick={() => handleRemoveAttribute(key)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">{isEditing ? "Update" : "Create"} Variant</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
