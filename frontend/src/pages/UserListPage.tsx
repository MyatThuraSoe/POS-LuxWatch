import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../components/common";
import { UserTable, UserFilters } from "../components/users";
import { Button } from "../components/ui/button";
import { Dialog } from "../components/ui/dialog";
import { useUsers, useDeleteUser, useToggleUserStatus } from "../hooks/useUsers";
import { useAuthStore } from "../stores/authStore";
import type { UserStatus } from "../types/user";

export function UserListPage() {
  const navigate = useNavigate();
  const currentUser = useAuthStore((state) => state.user);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    search: "",
    role: "",
    status: "",
    sort_by: "name",
    sort_order: "asc" as "asc" | "desc",
  });

  const { data, isLoading } = useUsers({
    page,
    per_page: 10,
    ...filters,
  });

  const deleteUserMutation = useDeleteUser();
  const toggleStatusMutation = useToggleUserStatus();

  const handleViewUser = (id: number) => {
    navigate(`/users/${id}`);
  };

  const handleEditUser = (id: number) => {
    navigate(`/users/${id}/edit`);
  };

  const handleDeleteUser = (id: number) => {
    if (currentUser?.id === id) {
      alert("You cannot delete yourself");
      return;
    }
    if (confirm("Are you sure you want to delete this user?")) {
      deleteUserMutation.mutate(id);
    }
  };

  const handleToggleStatus = (id: number, status: UserStatus) => {
    toggleStatusMutation.mutate({ id, status });
  };

  const handleSort = (sortBy: string) => {
    setFilters((prev) => ({
      ...prev,
      sort_by: sortBy,
      sort_order: prev.sort_order === "asc" ? "desc" : "asc",
    }));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="User Management"
        title="Users"
        description="Manage system users, roles, and permissions"
        actions={
          <Button onClick={() => navigate("/users/create")}>
            Create User
          </Button>
        }
      />

      <UserFilters
        search={filters.search}
        onSearchChange={(value) => setFilters((prev) => ({ ...prev, search: value }))}
        role={filters.role}
        onRoleChange={(value) => setFilters((prev) => ({ ...prev, role: value }))}
        status={filters.status}
        onStatusChange={(value) => setFilters((prev) => ({ ...prev, status: value }))}
        sortBy={filters.sort_by}
        onSortByChange={(value) => setFilters((prev) => ({ ...prev, sort_by: value }))}
        sortOrder={filters.sort_order}
        onSortOrderChange={(value) => setFilters((prev) => ({ ...prev, sort_order: value }))}
        onReset={() =>
          setFilters({
            search: "",
            role: "",
            status: "",
            sort_by: "name",
            sort_order: "asc",
          })
        }
      />

      <UserTable
        users={data?.data || []}
        onViewUser={handleViewUser}
        onEditUser={handleEditUser}
        onDeleteUser={handleDeleteUser}
        onToggleStatus={handleToggleStatus}
        isLoading={isLoading}
      />

      {data && data.meta.last_page > 1 && (
        <div className="flex items-center justify-between pt-4">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Showing {data.meta.current_page} of {data.meta.last_page} pages
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() => setPage((p) => Math.min(data.meta.last_page, p + 1))}
              disabled={page === data.meta.last_page}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
