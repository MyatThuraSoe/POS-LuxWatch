import type { ChangeEvent } from "react";
import { Input } from "../ui/input";
import { Select } from "../ui/select";
import { FormField } from "../forms/FormField";
import { RoleSelect } from "./RoleSelect";
import type { CreateUserPayload, UpdateUserPayload, User, UserStatus } from "../../types/user";
import type { UserRoleName } from "../../stores/authStore";

type UserFormProps = {
  user?: User;
  onSubmit: (data: CreateUserPayload | UpdateUserPayload) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
};

export function UserForm({ user, onSubmit, onCancel, isSubmitting = false }: UserFormProps) {
  const isEdit = !!user;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    if (!isEdit) {
      const data: CreateUserPayload = {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        role: formData.get("role") as UserRoleName,
        phone: (formData.get("phone") as string) || null,
      };
      onSubmit(data);
    } else {
      const data: UpdateUserPayload = {
        name: formData.get("name") as string | undefined,
        email: formData.get("email") as string | undefined,
        role: formData.get("role") as UserRoleName | undefined,
        phone: (formData.get("phone") as string) || null,
        status: formData.get("status") as UserStatus | undefined,
      };
      onSubmit(data);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <FormField label="Name" name="name" required minLength={2}>
          <Input
            name="name"
            defaultValue={user?.name}
            placeholder="Enter full name"
            disabled={isSubmitting}
            required
            minLength={2}
          />
        </FormField>

        <FormField label="Email" name="email" type="email" required>
          <Input
            name="email"
            type="email"
            defaultValue={user?.email}
            placeholder="Enter email address"
            disabled={isSubmitting}
            required
          />
        </FormField>

        {!isEdit && (
          <FormField label="Password" name="password" type="password" required minLength={8}>
            <Input
              name="password"
              type="password"
              placeholder="Enter password (min 8 chars)"
              disabled={isSubmitting}
              required
              minLength={8}
            />
          </FormField>
        )}

        <FormField label="Phone" name="phone" type="tel">
          <Input
            name="phone"
            type="tel"
            defaultValue={user?.phone || ""}
            placeholder="Enter phone number"
            disabled={isSubmitting}
          />
        </FormField>

        <div className="md:col-span-2">
          <RoleSelect
            value={user?.role}
            onChange={() => {}}
            disabled={isSubmitting}
          />
          <input type="hidden" name="role" defaultValue={user?.role || "employee"} />
        </div>

        {isEdit && (
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-slate-900 dark:text-slate-50">Status</label>
            <Select
              name="status"
              defaultValue={user?.status || "active"}
              disabled={isSubmitting}
              className="mt-2"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </Select>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex h-10 items-center justify-center rounded-md border border-slate-200 bg-white px-4 text-sm font-medium transition-colors hover:bg-slate-50 focus-visible:focus-ring disabled:pointer-events-none disabled:opacity-50 dark:border-slate-700 dark:bg-slate-950 dark:hover:bg-slate-900"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex h-10 items-center justify-center rounded-md bg-brand-700 px-4 text-sm font-medium text-white transition-colors hover:bg-brand-600 focus-visible:focus-ring disabled:pointer-events-none disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : isEdit ? "Update User" : "Create User"}
        </button>
      </div>
    </form>
  );
}
