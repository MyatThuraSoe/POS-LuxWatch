import { useState, useMemo } from "react";
import type { Permission, UserPermissions } from "../../types/user";
import { PermissionCheckbox } from "./PermissionCheckbox";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";

type PermissionMatrixProps = {
  permissions: Permission[];
  userPermissions?: UserPermissions;
  onSave: (permissions: string[]) => void;
  isSaving?: boolean;
};

export function PermissionMatrix({
  permissions,
  userPermissions,
  onSave,
  isSaving = false,
}: PermissionMatrixProps) {
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(
    new Set(userPermissions?.permissions || [])
  );

  const groupedPermissions = useMemo(() => {
    const groups: Record<string, Permission[]> = {};
    permissions.forEach((permission) => {
      if (!groups[permission.group]) {
        groups[permission.group] = [];
      }
      groups[permission.group].push(permission);
    });
    return groups;
  }, [permissions]);

  const handleToggle = (permissionName: string, checked: boolean) => {
    setSelectedPermissions((prev) => {
      const next = new Set(prev);
      if (checked) {
        next.add(permissionName);
      } else {
        next.delete(permissionName);
      }
      return next;
    });
  };

  const handleSelectAll = (group: string, checked: boolean) => {
    const groupPermissions = groupedPermissions[group] || [];
    setSelectedPermissions((prev) => {
      const next = new Set(prev);
      groupPermissions.forEach((p) => {
        if (checked) {
          next.add(p.name);
        } else {
          next.delete(p.name);
        }
      });
      return next;
    });
  };

  const handleSave = () => {
    onSave(Array.from(selectedPermissions));
  };

  const isGroupAllSelected = (group: string) => {
    const groupPermissions = groupedPermissions[group] || [];
    return groupPermissions.every((p) => selectedPermissions.has(p.name));
  };

  const isGroupSomeSelected = (group: string) => {
    const groupPermissions = groupedPermissions[group] || [];
    return groupPermissions.some((p) => selectedPermissions.has(p.name));
  };

  return (
    <div className="space-y-6">
      {Object.entries(groupedPermissions).map(([group, groupPermissions]) => (
        <div key={group} className="rounded-lg border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/50">
            <h3 className="text-sm font-semibold capitalize text-slate-900 dark:text-slate-50">
              {group}
            </h3>
            <label className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400">
              <input
                type="checkbox"
                checked={isGroupAllSelected(group)}
                ref={(el) => {
                  if (el) el.indeterminate = isGroupSomeSelected(group) && !isGroupAllSelected(group);
                }}
                onChange={(e) => handleSelectAll(group, e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
              />
              Select All
            </label>
          </div>
          <div className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3">
            {groupPermissions.map((permission) => (
              <PermissionCheckbox
                key={permission.id}
                permission={permission}
                checked={selectedPermissions.has(permission.name)}
                onChange={handleToggle}
                disabled={isSaving}
              />
            ))}
          </div>
        </div>
      ))}

      <div className="flex justify-end gap-3 pt-4">
        <Button variant="outline" onClick={() => setSelectedPermissions(new Set())} disabled={isSaving}>
          Deselect All
        </Button>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? <Spinner size="sm" /> : null}
          {isSaving ? "Saving..." : "Save Permissions"}
        </Button>
      </div>
    </div>
  );
}
