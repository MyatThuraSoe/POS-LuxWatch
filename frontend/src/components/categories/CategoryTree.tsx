import { CategoryNode } from "./CategoryNode";
import type { CategoryTreeNode } from "../../types/product";

interface CategoryTreeProps {
  categories: CategoryTreeNode[];
  onSelect?: (category: CategoryTreeNode) => void;
  onEdit?: (category: CategoryTreeNode) => void;
  onDelete?: (category: CategoryTreeNode) => void;
  selectedId?: number | null;
  editable?: boolean;
}

export const CategoryTree = ({
  categories,
  onSelect,
  onEdit,
  onDelete,
  selectedId,
  editable = false,
}: CategoryTreeProps) => {
  if (!categories || categories.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No categories found. Create one to get started.
      </div>
    );
  }

  return (
    <div className="border rounded-lg bg-white">
      {categories.map((category) => (
        <CategoryNode
          key={category.id}
          node={category}
          level={0}
          onSelect={onSelect}
          onEdit={onEdit}
          onDelete={onDelete}
          selectedId={selectedId}
          editable={editable}
        />
      ))}
    </div>
  );
};
