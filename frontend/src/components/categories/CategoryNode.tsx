import { useState } from "react";
import { Button, Input, Badge } from "../ui";
import type { CategoryTreeNode } from "../../types/product";

interface CategoryNodeProps {
  node: CategoryTreeNode;
  level: number;
  onSelect?: (category: CategoryTreeNode) => void;
  onEdit?: (category: CategoryTreeNode) => void;
  onDelete?: (category: CategoryTreeNode) => void;
  selectedId?: number | null;
  editable?: boolean;
}

export const CategoryNode = ({
  node,
  level,
  onSelect,
  onEdit,
  onDelete,
  selectedId,
  editable = false,
}: CategoryNodeProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = node.has_children || (node.children && node.children.length > 0);
  const isSelected = selectedId === node.id;

  const handleToggle = () => {
    if (hasChildren) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div className="select-none">
      <div
        className={`flex items-center gap-2 py-2 px-3 rounded-lg cursor-pointer transition-colors ${
          isSelected ? "bg-blue-100 border-blue-300" : "hover:bg-gray-50"
        }`}
        style={{ paddingLeft: `${level * 24 + 12}px` }}
        onClick={() => onSelect?.(node)}
      >
        {/* Expand/Collapse button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleToggle();
          }}
          className={`w-5 h-5 flex items-center justify-center rounded hover:bg-gray-200 ${
            !hasChildren ? "invisible" : ""
          }`}
        >
          {isExpanded ? "▼" : "▶"}
        </button>

        {/* Category info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium truncate">{node.name}</span>
            {!node.is_active && <Badge variant="default">Inactive</Badge>}
            {node.product_count !== undefined && (
              <span className="text-xs text-gray-500">({node.product_count} products)</span>
            )}
          </div>
        </div>

        {/* Actions */}
        {editable && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); onEdit?.(node); }}>
              Edit
            </Button>
            <Button size="sm" variant="danger" onClick={(e) => { e.stopPropagation(); onDelete?.(node); }}>
              Delete
            </Button>
          </div>
        )}
      </div>

      {/* Children */}
      {isExpanded && hasChildren && node.children && (
        <div>
          {node.children.map((child) => (
            <CategoryNode
              key={child.id}
              node={child as CategoryTreeNode}
              level={level + 1}
              onSelect={onSelect}
              onEdit={onEdit}
              onDelete={onDelete}
              selectedId={selectedId}
              editable={editable}
            />
          ))}
        </div>
      )}
    </div>
  );
};
