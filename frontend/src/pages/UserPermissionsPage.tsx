import { useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "../components/common";
import { UserAvatar, UserStatusBadge, PermissionMatrix } from "../components/users";
import { useUser, useUserPermissions, usePermissions, useUpdatePermissions } from "../hooks/useUsers";
import { Spinner } from "../components/ui/spinner";
import { Badge } from "../components/ui/badge";

export function UserPermissionsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const userId = id ? parseInt(id, 10) : 0;

  const { data: user, isLoading: userLoading } = useUser(userId);
  const { data: userPermissions, isLoading: permsLoading } = useUserPermissions(userId);
  const { data: allPermissions, isLoading: allPermsLoading } = usePermissions();
  const updatePermissionsMutation = useUpdatePermissions(userId);

  const handleSave = (permissions: string[]) => {
    updatePermissionsMutation.mutate(permissions, {
      onSuccess: () => {
        navigate(`/users/${userId}`);
      },
    });
  };

  if (userLoading || permsLoading || allPermsLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user || !allPermissions) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">Data not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="User Management"
        title={`Permissions: ${user.name}`}
        description="Manage user permissions and access rights"
        actions={
          <Badge variant="outline">{user.role}</Badge>
        }
      />
      <div className="mx-auto max-w-4xl rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
        <div className="mb-6 flex items-center gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <UserAvatar user={user} size="lg" />
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">{user.name}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
            <div className="mt-2 flex items-center gap-2">
              <UserStatusBadge status={user.status} />
              <span className="text-xs text-slate-500">
                {userPermissions?.permissions.length || 0} permissions assigned
              </span>
            </div>
          </div>
        </div>
        <PermissionMatrix
          permissions={allPermissions}
          userPermissions={userPermissions}
          onSave={handleSave}
          isSaving={updatePermissionsMutation.isPending}
        />
      </div>
    </div>
  );
}
