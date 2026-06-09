import type { UserRoleName } from "../../stores/authStore";

type RoleSelectProps = {
  value?: UserRoleName;
  onChange: (value: UserRoleName) => void;
  disabled?: boolean;
  error?: string;
};

const roles: { value: UserRoleName; label: string; description: string }[] = [
  { value: "owner", label: "Owner", description: "Full access to all features" },
  { value: "admin", label: "Admin", description: "Manage users and settings" },
  { value: "employee", label: "Employee", description: "Limited access for daily operations" },
];

export function RoleSelect({ value, onChange, disabled, error }: RoleSelectProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-900 dark:text-slate-50">Role</label>
      <div className="grid gap-3 sm:grid-cols-3">
        {roles.map((role) => (
          <button
            key={role.value}
            type="button"
            onClick={() => onChange(role.value)}
            disabled={disabled}
            className={`flex flex-col items-start rounded-md border p-3 text-left transition-colors focus-visible:focus-ring disabled:pointer-events-none disabled:opacity-50 ${
              value === role.value
                ? "border-brand-600 bg-brand-50 dark:border-brand-500 dark:bg-brand-900/20"
                : "border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600"
            }`}
          >
            <span className="text-sm font-medium">{role.label}</span>
            <span className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {role.description}
            </span>
          </button>
        ))}
      </div>
      {error ? <p className="text-xs text-rose-600">{error}</p> : null}
    </div>
  );
}
