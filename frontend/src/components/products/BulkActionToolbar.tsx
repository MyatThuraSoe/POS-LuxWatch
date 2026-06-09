import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, Download, Upload } from 'lucide-react';

interface BulkActionToolbarProps {
  selectedCount: number;
  onBulkDelete: () => void;
  onBulkStatusChange?: (status: 'active' | 'inactive') => void;
  onExport?: () => void;
  onImport?: () => void;
}

export function BulkActionToolbar({
  selectedCount,
  onBulkDelete,
  onBulkStatusChange,
  onExport,
  onImport,
}: BulkActionToolbarProps) {
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  if (selectedCount === 0) return null;

  return (
    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Checkbox checked disabled />
        <span className="font-medium">{selectedCount} item(s) selected</span>
      </div>

      <div className="flex items-center gap-2">
        {onExport && (
          <Button variant="outline" size="sm" onClick={onExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        )}

        {onImport && (
          <Button variant="outline" size="sm" onClick={onImport}>
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
        )}

        {onBulkStatusChange && (
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowStatusMenu(!showStatusMenu)}
            >
              Set Status
            </Button>

            {showStatusMenu && (
              <div className="absolute right-0 mt-1 w-48 bg-white border rounded-md shadow-lg z-10">
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 first:rounded-t-md"
                  onClick={() => {
                    onBulkStatusChange('active');
                    setShowStatusMenu(false);
                  }}
                >
                  Set Active
                </button>
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 last:rounded-b-md"
                  onClick={() => {
                    onBulkStatusChange('inactive');
                    setShowStatusMenu(false);
                  }}
                >
                  Set Inactive
                </button>
              </div>
            )}
          </div>
        )}

        <Button
          variant="danger"
          size="sm"
          onClick={onBulkDelete}
          className="ml-2"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Selected
        </Button>
      </div>
    </div>
  );
}
