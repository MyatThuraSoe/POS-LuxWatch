import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useSettings, useUpdateSettings } from '@/hooks/useSettings';
import { Loader2 } from 'lucide-react';

import { TaxSettings } from '@/types/settings';

const TaxSettingsPage: React.FC = () => {
  const { toast } = useToast();
  const { data: settings, isLoading } = useSettings();
  const updateSettings = useUpdateSettings();

  const [formData, setFormData] = React.useState<TaxSettings>({
    enabled: true,
    rate: 0,
    type: 'exclusive',
    label: 'Tax',
    taxId: ''
  });

  React.useEffect(() => {
    if (settings?.tax) {
      setFormData(settings.tax);
    }
  }, [settings]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings.mutate(
      { tax: formData },
      {
        onSuccess: () => {
          toast({
            title: 'Tax Settings Saved',
            description: 'Your tax configuration has been updated successfully.'
          });
        },
        onError: () => {
          toast({
            title: 'Error',
            description: 'Failed to save tax settings.',
            variant: 'destructive'
          });
        }
      }
    );
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
        <h1 className="text-3xl font-bold">Tax Settings</h1>
        <p className="text-muted-foreground">Configure tax rates and rules for your store</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tax Configuration</CardTitle>
          <CardDescription>Set up your tax preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <Label htmlFor="enabled" className="font-medium">Enable Tax</Label>
                <p className="text-sm text-muted-foreground">Toggle tax calculation on or off</p>
              </div>
              <Switch
                id="enabled"
                checked={formData.enabled}
                onCheckedChange={(checked) => setFormData({ ...formData, enabled: checked })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="rate">Tax Rate (%) *</Label>
                <Input
                  id="rate"
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={formData.rate}
                  onChange={(e) => setFormData({ ...formData, rate: parseFloat(e.target.value) || 0 })}
                  placeholder="Enter tax rate"
                  disabled={!formData.enabled}
                  required={formData.enabled}
                />
              </div>
              <div>
                <Label htmlFor="taxId">Tax ID Number</Label>
                <Input
                  id="taxId"
                  value={formData.taxId}
                  onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                  placeholder="Enter tax identification number"
                  disabled={!formData.enabled}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="type">Tax Type</Label>
              <select
                id="type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'inclusive' | 'exclusive' })}
                className="w-full p-2 border rounded-md"
                disabled={!formData.enabled}
              >
                <option value="exclusive">Exclusive (added to price)</option>
                <option value="inclusive">Inclusive (included in price)</option>
              </select>
            </div>

            <div>
              <Label htmlFor="label">Tax Label</Label>
              <Input
                id="label"
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                placeholder="e.g., VAT, Sales Tax, GST"
                disabled={!formData.enabled}
              />
              <p className="text-sm text-muted-foreground mt-1">
                This label will appear on receipts and invoices
              </p>
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={updateSettings.isPending || !formData.enabled}>
                {updateSettings.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setFormData(settings?.tax || formData)}
                disabled={!formData.enabled}
              >
                Reset
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaxSettingsPage;
