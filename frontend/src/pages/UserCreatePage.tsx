import { useNavigate } from "react-router-dom";
import { PageHeader } from "../components/common";
import { UserForm } from "../components/users";
import { useCreateUser } from "../hooks/useUsers";
import type { CreateUserPayload, UpdateUserPayload } from "../types/user";

export function UserCreatePage() {
  const navigate = useNavigate();
  const createUserMutation = useCreateUser();

  const handleSubmit = (data: CreateUserPayload | UpdateUserPayload) => {
    if ('password' in data && data.password !== undefined) {
      createUserMutation.mutate(data as CreateUserPayload);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="User Management"
        title="Create User"
        description="Add a new user to the system"
      />
      <div className="mx-auto max-w-2xl rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
        <UserForm
          onSubmit={handleSubmit}
          onCancel={() => navigate("/users")}
          isSubmitting={createUserMutation.isPending}
        />
      </div>
    </div>
  );
}
