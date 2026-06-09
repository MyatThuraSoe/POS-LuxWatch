import type { Permission } from "../../types/user";

type PermissionCheckboxProps = {
  permission: Permission;
  checked: boolean;
  onChange: (permissionName: string, checked: boolean) => void;
  disabled?: boolean;
};

export function PermissionCheckbox({
  permission,
  checked,
  onChange,
  disabled = false,
}: PermissionCheckboxProps) {
  return (
    <label className="flex items-start gap-3 rounded-md border border-slate-200 p-3 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900/50">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(permission.name, e.target.checked)}
        disabled={disabled}
        className="mt-0.5 h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500 disabled:opacity-50"
      />
      <div className="flex-1">
        <p className="text-sm font-medium text-slate-900 dark:text-slate-50">
          {permission.name}
        </p>
        {permission.description && (
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            {permission.description}
          </p>
        )}
      </div>
    </label>
  );
}
