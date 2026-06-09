import { useState, useEffect } from "react";
import { Input, Button, Label, Select, Card, CardContent } from "../ui";
import type { Category, CreateCategoryPayload, UpdateCategoryPayload } from "../../types/product";

interface CategoryFormProps {
  category?: Category | null;
  categories?: Category[];
  onSubmit: (data: CreateCategoryPayload) => void;
  onCancel: () => void;
  isEditing?: boolean;
  isSubmitting?: boolean;
}

export const CategoryForm = ({
  category,
  categories,
  onSubmit,
  onCancel,
  isEditing = false,
}: CategoryFormProps) => {
  const [formData, setFormData] = useState<CreateCategoryPayload>({
    name: category?.name || "",
    slug: category?.slug || "",
    description: category?.description || "",
    parent_id: category?.parent_id || null,
    image_url: category?.image_url || "",
    position: category?.position || 0,
    is_active: category?.is_active ?? true,
  });

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || "",
        slug: category.slug || "",
        description: category.description || "",
        parent_id: category.parent_id || null,
        image_url: category.image_url || "",
        position: category.position || 0,
        is_active: category.is_active ?? true,
      });
    }
  }, [category]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Filter out current category and its children from parent options to prevent circular reference
  const getParentOptions = () => {
    if (!categories) return [];
    const filtered = categories.filter((c) => c.id !== category?.id);
    return filtered;
  };

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                minLength={2}
              />
            </div>

            <div>
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="auto-generated"
              />
            </div>

            <div>
              <Label htmlFor="parent_id">Parent Category</Label>
              <Select
                id="parent_id"
                value={formData.parent_id?.toString() || ""}
                onChange={(e) =>
                  setFormData({ ...formData, parent_id: e.target.value ? Number(e.target.value) : null })
                }
                options={[
                  { value: "", label: "No Parent (Root)" },
                  ...getParentOptions().map((cat) => ({ value: cat.id.toString(), label: cat.name }))
                ]}
              />
            </div>

            <div>
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                type="number"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: Number(e.target.value) })}
                min={0}
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                rows={3}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.description || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="image_url">Image URL</Label>
              <Input
                id="image_url"
                type="url"
                value={formData.image_url || ""}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              />
              <Label htmlFor="is_active">Active</Label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">{isEditing ? "Update" : "Create"} Category</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
