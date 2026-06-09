import { useState } from "react";
import { Search, Filter } from "lucide-react";
import { Input } from "../ui/input";
import { Select } from "../ui/select";
import { Button } from "../ui/button";
import type { UserRoleName } from "../../stores/authStore";

type UserFiltersProps = {
  search: string;
  onSearchChange: (value: string) => void;
  role?: UserRoleName | "";
  onRoleChange: (value: UserRoleName | "") => void;
  status?: string;
  onStatusChange: (value: string) => void;
  sortBy?: string;
  onSortByChange: (value: string) => void;
  sortOrder?: "asc" | "desc";
  onSortOrderChange: (value: "asc" | "desc") => void;
  onReset: () => void;
};

export function UserFilters({
  search,
  onSearchChange,
  role,
  onRoleChange,
  status,
  onStatusChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
  onReset,
}: UserFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name or email..."
            className="pl-9"
          />
        </div>
        <Button
          variant="secondary"
          onClick={() => setIsExpanded(!isExpanded)}
          className="shrink-0"
        >
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </div>

      {isExpanded && (
        <div className="grid gap-3 rounded-md border border-slate-200 p-4 dark:border-slate-800 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Role</label>
            <Select value={role || ""} onChange={(e) => onRoleChange(e.target.value as UserRoleName | "")}>
              <option value="">All Roles</option>
              <option value="owner">Owner</option>
              <option value="admin">Admin</option>
              <option value="employee">Employee</option>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Status</label>
            <Select value={status || ""} onChange={(e) => onStatusChange(e.target.value)}>
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Sort By</label>
            <Select value={sortBy || "name"} onChange={(e) => onSortByChange(e.target.value)}>
              <option value="name">Name</option>
              <option value="email">Email</option>
              <option value="created_at">Created Date</option>
              <option value="role">Role</option>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Order</label>
            <Select
              value={sortOrder || "asc"}
              onChange={(e) => onSortOrderChange(e.target.value as "asc" | "desc")}
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </Select>
          </div>

          <div className="flex items-end sm:col-span-2 lg:col-span-4">
            <button
              type="button"
              onClick={onReset}
              className="text-xs font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
            >
              Reset all filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
