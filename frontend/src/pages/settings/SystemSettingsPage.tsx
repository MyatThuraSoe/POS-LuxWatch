import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useSettings, useUpdateSettings } from '@/hooks/useSettings';
import { Loader2, Database, RefreshCw, AlertTriangle } from 'lucide-react';

import { SystemSettings } from '@/types/settings';

const SystemSettingsPage: React.FC = () => {
  const { toast } = useToast();
  const { data: settings, isLoading } = useSettings();
  const updateSettings = useUpdateSettings();

  const [formData, setFormData] = React.useState<SystemSettings>({
    version: '1.0.0',
    lastBackup: undefined,
    autoUpdate: true,
    maintenanceMode: false,
    apiEndpoint: '/api'
  });

  React.useEffect(() => {
    if (settings?.system) {
      setFormData(settings.system);
    }
  }, [settings]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings.mutate(
      { system: formData },
      {
        onSuccess: () => {
          toast({
            title: 'System Settings Saved',
            description: 'Your system configuration has been updated successfully.'
          });
        },
        onError: () => {
          toast({
            title: 'Error',
            description: 'Failed to save system settings.',
            variant: 'destructive'
          });
        }
      }
    );
  };

  const handleBackup = () => {
    toast({
      title: 'Backup Started',
      description: 'Creating database backup...'
    });
  };

  const handleCheckUpdates = () => {
    toast({
      title: 'Checking for Updates',
      description: 'Looking for available updates...'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">System Settings</h1>
        <p className="text-muted-foreground">Advanced system configuration and maintenance</p>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>System Information</CardTitle>
            <CardDescription>Current system status and version</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <Label className="text-sm text-muted-foreground">Version</Label>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-lg font-semibold">{formData.version}</span>
                  <Badge variant="default">Latest</Badge>
                </div>
              </div>
              <div className="p-4 border rounded-lg">
                <Label className="text-sm text-muted-foreground">Last Backup</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Database className="h-4 w-4 text-muted-foreground" />
                  <span>{formData.lastBackup || 'No backup found'}</span>
                </div>
              </div>
              <div className="p-4 border rounded-lg">
                <Label className="text-sm text-muted-foreground">API Endpoint</Label>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-mono text-sm">{formData.apiEndpoint}</span>
                </div>
              </div>
              <div className="p-4 border rounded-lg">
                <Label className="text-sm text-muted-foreground">System Status</Label>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-green-600 font-medium">Operational</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Configuration</CardTitle>
            <CardDescription>Configure system behavior and modes</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label htmlFor="autoUpdate" className="font-medium">Auto Update</Label>
                  <p className="text-sm text-muted-foreground">Automatically check and install updates</p>
                </div>
                <Switch
                  id="autoUpdate"
                  checked={formData.autoUpdate}
                  onCheckedChange={(checked) => setFormData({ ...formData, autoUpdate: checked })}
                />
              </div>

              <div className={`p-4 border rounded-lg ${formData.maintenanceMode ? 'bg-yellow-50 border-yellow-200' : ''}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className={`h-5 w-5 ${formData.maintenanceMode ? 'text-yellow-600' : 'text-muted-foreground'}`} />
                    <div>
                      <Label htmlFor="maintenanceMode" className="font-medium">Maintenance Mode</Label>
                      <p className="text-sm text-muted-foreground">Disable access for regular users</p>
                    </div>
                  </div>
                  <Switch
                    id="maintenanceMode"
                    checked={formData.maintenanceMode}
                    onCheckedChange={(checked) => setFormData({ ...formData, maintenanceMode: checked })}
                  />
                </div>
                {formData.maintenanceMode && (
                  <p className="text-sm text-yellow-700 mt-2">
                    ⚠️ Warning: Maintenance mode is currently active. Regular users cannot access the system.
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={updateSettings.isPending}>
                  {updateSettings.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
                <Button type="button" variant="outline" onClick={() => setFormData(settings?.system || formData)}>
                  Reset
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Maintenance</CardTitle>
            <CardDescription>System maintenance and data management</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">Backup Data</h3>
                  <p className="text-sm text-muted-foreground">Create a full system backup</p>
                </div>
                <Button variant="outline" onClick={handleBackup}>
                  <Database className="mr-2 h-4 w-4" />
                  Backup Now
                </Button>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">Check for Updates</h3>
                  <p className="text-sm text-muted-foreground">Look for available system updates</p>
                </div>
                <Button variant="outline" onClick={handleCheckUpdates}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Check Updates
                </Button>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">Export Settings</h3>
                  <p className="text-sm text-muted-foreground">Download all system settings</p>
                </div>
                <Button variant="outline" onClick={() => toast({ title: 'Export', description: 'Settings export started' })}>
                  Export
                </Button>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg border-red-200 bg-red-50">
                <div>
                  <h3 className="font-medium text-red-700">Reset to Defaults</h3>
                  <p className="text-sm text-red-600">Restore all settings to factory defaults</p>
                </div>
                <Button 
                  variant="danger" 
                  onClick={() => toast({ 
                    title: 'Confirm Reset', 
                    description: 'This action cannot be undone. Please confirm in the dialog.',
                    variant: 'destructive'
                  })}
                >
                  Reset All
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SystemSettingsPage;
