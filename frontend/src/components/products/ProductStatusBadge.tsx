import { Badge } from "../ui";
import type { ProductStatus } from "../../types/product";

interface ProductStatusBadgeProps {
  status: ProductStatus;
}

export const ProductStatusBadge = ({ status }: ProductStatusBadgeProps) => {
  const variants: Record<ProductStatus, "default" | "success" | "warning" | "danger"> = {
    active: "success",
    inactive: "default",
    draft: "warning",
    archived: "default",
  };

  const labels: Record<ProductStatus, string> = {
    active: "Active",
    inactive: "Inactive",
    draft: "Draft",
    archived: "Archived",
  };

  return <Badge variant={variants[status]}>{labels[status]}</Badge>;
};
