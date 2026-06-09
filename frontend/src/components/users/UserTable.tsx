import type { User } from "../../types/user";
import { formatCurrency, formatDate } from "../../lib/utils";
import { UserStatusBadge } from "./UserStatusBadge";
import { UserAvatar } from "./UserAvatar";

type UserTableProps = {
  users: User[];
  onViewUser: (id: number) => void;
  onEditUser: (id: number) => void;
  onDeleteUser: (id: number) => void;
  onToggleStatus: (id: number, status: "active" | "inactive" | "suspended") => void;
  isLoading?: boolean;
};

export function UserTable({
  users,
  onViewUser,
  onEditUser,
  onDeleteUser,
  onToggleStatus,
  isLoading = false,
}: UserTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="flex items-center gap-4 rounded-md border border-slate-200 p-4 dark:border-slate-800"
          >
            <div className="h-10 w-10 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/4 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-3 w-1/3 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-sm font-medium text-slate-900 dark:text-slate-50">No users found</p>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Try adjusting your search or filters
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[600px]">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-800">
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
              User
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Role
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Status
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Created
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {users.map((user) => (
            <tr
              key={user.id}
              className="group transition-colors hover:bg-slate-50 dark:hover:bg-slate-900/50"
            >
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <UserAvatar user={user} size="md" />
                  <div>
                    <p className="font-medium text-slate-900 dark:text-slate-50">{user.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3">
                <span className="capitalize text-sm text-slate-700 dark:text-slate-300">
                  {user.role}
                </span>
              </td>
              <td className="px-4 py-3">
                <UserStatusBadge status={user.status} />
              </td>
              <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                {formatDate(user.createdAt || "")}
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={() => onViewUser(user.id)}
                    className="rounded px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                  >
                    View
                  </button>
                  <button
                    onClick={() => onEditUser(user.id)}
                    className="rounded px-2 py-1 text-xs font-medium text-brand-600 hover:bg-brand-50 dark:text-brand-400 dark:hover:bg-brand-900/20"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() =>
                      onToggleStatus(
                        user.id,
                        user.status === "active" ? "inactive" : "active",
                      )
                    }
                    className="rounded px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                  >
                    {user.status === "active" ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    onClick={() => onDeleteUser(user.id)}
                    className="rounded px-2 py-1 text-xs font-medium text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-900/20"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
