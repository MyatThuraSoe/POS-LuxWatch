import { useParams, useNavigate } from "react-router-dom";
import { PageHeader } from "../components/common";
import { UserAvatar, UserStatusBadge } from "../components/users";
import { useUser } from "../hooks/useUsers";
import { Spinner } from "../components/ui/spinner";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { formatDate } from "../lib/utils";

export function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const userId = id ? parseInt(id, 10) : 0;

  const { data: user, isLoading } = useUser(userId);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">User not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="User Management"
        title={user.name}
        description="User details and information"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate(`/users/${userId}/permissions`)}>
              Manage Permissions
            </Button>
            <Button onClick={() => navigate(`/users/${userId}/edit`)}>
              Edit User
            </Button>
          </div>
        }
      />
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
          <h3 className="mb-4 text-sm font-semibold text-slate-900 dark:text-slate-50">
            Profile Information
          </h3>
          <div className="flex items-center gap-4 pb-6 mb-6 border-b border-slate-200 dark:border-slate-800">
            <UserAvatar user={user} size="lg" />
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">{user.name}</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
            </div>
          </div>
          <dl className="space-y-3">
            <div className="flex justify-between">
              <dt className="text-sm text-slate-500 dark:text-slate-400">Email</dt>
              <dd className="text-sm font-medium text-slate-900 dark:text-slate-50">{user.email}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-slate-500 dark:text-slate-400">Phone</dt>
              <dd className="text-sm font-medium text-slate-900 dark:text-slate-50">
                {user.phone || "Not provided"}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-slate-500 dark:text-slate-400">Role</dt>
              <dd className="text-sm font-medium capitalize text-slate-900 dark:text-slate-50">
                {user.role}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-slate-500 dark:text-slate-400">Status</dt>
              <dd>
                <UserStatusBadge status={user.status} />
              </dd>
            </div>
          </dl>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
          <h3 className="mb-4 text-sm font-semibold text-slate-900 dark:text-slate-50">
            Account Details
          </h3>
          <dl className="space-y-3">
            <div className="flex justify-between">
              <dt className="text-sm text-slate-500 dark:text-slate-400">Created At</dt>
              <dd className="text-sm font-medium text-slate-900 dark:text-slate-50">
                {formatDate(user.createdAt || "")}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-slate-500 dark:text-slate-400">Last Updated</dt>
              <dd className="text-sm font-medium text-slate-900 dark:text-slate-50">
                {formatDate(user.updatedAt || "")}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-slate-500 dark:text-slate-400">Permissions</dt>
              <dd className="text-sm font-medium text-slate-900 dark:text-slate-50">
                {user.permissions.length} assigned
              </dd>
            </div>
          </dl>
          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Assigned Permissions
            </h4>
            <div className="flex flex-wrap gap-2">
              {user.permissions.slice(0, 10).map((perm) => (
                <Badge key={perm} variant="outline" className="text-xs">
                  {perm}
                </Badge>
              ))}
              {user.permissions.length > 10 && (
                <Badge variant="default">+{user.permissions.length - 10} more</Badge>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
