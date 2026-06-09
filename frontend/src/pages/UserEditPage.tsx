import { useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "../components/common";
import { UserForm, UserAvatar, UserStatusBadge } from "../components/users";
import { useUser, useUpdateUser } from "../hooks/useUsers";
import type { UpdateUserPayload } from "../types/user";
import { Spinner } from "../components/ui/spinner";

export function UserEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const userId = id ? parseInt(id, 10) : 0;

  const { data: user, isLoading } = useUser(userId);
  const updateUserMutation = useUpdateUser(userId);

  const handleSubmit = (data: UpdateUserPayload) => {
    updateUserMutation.mutate(data, {
      onSuccess: () => {
        navigate(`/users/${userId}`);
      },
    });
  };

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
        title={`Edit: ${user.name}`}
        description="Update user information"
      />
      <div className="mx-auto max-w-2xl rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
        <div className="mb-6 flex items-center gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <UserAvatar user={user} size="lg" />
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">{user.name}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
            <div className="mt-2">
              <UserStatusBadge status={user.status} />
            </div>
          </div>
        </div>
        <UserForm
          user={user}
          onSubmit={handleSubmit}
          onCancel={() => navigate(`/users/${userId}`)}
          isSubmitting={updateUserMutation.isPending}
        />
      </div>
    </div>
  );
}
