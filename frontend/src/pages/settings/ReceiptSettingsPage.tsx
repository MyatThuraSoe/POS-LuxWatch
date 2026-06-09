import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useSettings, useUpdateSettings } from '@/hooks/useSettings';
import { Loader2 } from 'lucide-react';

const ReceiptSettingsPage: React.FC = () => {
  const { toast } = useToast();
  const { data: settings, isLoading } = useSettings();
  const updateSettings = useUpdateSettings();

  const [formData, setFormData] = React.useState({
    header: '',
    footer: '',
    showTax: true,
    showDiscount: true,
    showCustomer: true,
    showCashier: true,
    copies: 1,
    paperSize: '80mm' as '80mm' | '58mm'
  });

  React.useEffect(() => {
    if (settings?.receipt) {
      setFormData(settings.receipt);
    }
  }, [settings]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings.mutate(
      { receipt: formData },
      {
        onSuccess: () => {
          toast({
            title: 'Receipt Settings Saved',
            description: 'Your receipt template has been updated successfully.'
          });
        },
        onError: () => {
          toast({
            title: 'Error',
            description: 'Failed to save receipt settings.',
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
        <h1 className="text-3xl font-bold">Receipt Settings</h1>
        <p className="text-muted-foreground">Customize your receipt template and printing options</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Receipt Template</CardTitle>
          <CardDescription>Configure receipt appearance and content</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="header">Receipt Header</Label>
                <Textarea
                  id="header"
                  value={formData.header}
                  onChange={(e) => setFormData({ ...formData, header: e.target.value })}
                  placeholder="Thank you for shopping with us!"
                  rows={2}
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="footer">Receipt Footer</Label>
                <Textarea
                  id="footer"
                  value={formData.footer}
                  onChange={(e) => setFormData({ ...formData, footer: e.target.value })}
                  placeholder="Visit us again soon!"
                  rows={2}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="paperSize">Paper Size</Label>
                <select
                  id="paperSize"
                  value={formData.paperSize}
                  onChange={(e) => setFormData({ ...formData, paperSize: e.target.value as '80mm' | '58mm' })}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="80mm">80mm (Standard Thermal)</option>
                  <option value="58mm">58mm (Compact Thermal)</option>
                </select>
              </div>
              <div>
                <Label htmlFor="copies">Number of Copies</Label>
                <Input
                  id="copies"
                  type="number"
                  min="1"
                  max="5"
                  value={formData.copies}
                  onChange={(e) => setFormData({ ...formData, copies: parseInt(e.target.value) || 1 })}
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label>Receipt Content Options</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <Label htmlFor="showTax" className="font-medium">Show Tax</Label>
                    <p className="text-sm text-muted-foreground">Display tax breakdown</p>
                  </div>
                  <Switch
                    id="showTax"
                    checked={formData.showTax}
                    onCheckedChange={(checked) => setFormData({ ...formData, showTax: checked })}
                  />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <Label htmlFor="showDiscount" className="font-medium">Show Discount</Label>
                    <p className="text-sm text-muted-foreground">Display discount details</p>
                  </div>
                  <Switch
                    id="showDiscount"
                    checked={formData.showDiscount}
                    onCheckedChange={(checked) => setFormData({ ...formData, showDiscount: checked })}
                  />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <Label htmlFor="showCustomer" className="font-medium">Show Customer</Label>
                    <p className="text-sm text-muted-foreground">Display customer info</p>
                  </div>
                  <Switch
                    id="showCustomer"
                    checked={formData.showCustomer}
                    onCheckedChange={(checked) => setFormData({ ...formData, showCustomer: checked })}
                  />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <Label htmlFor="showCashier" className="font-medium">Show Cashier</Label>
                    <p className="text-sm text-muted-foreground">Display cashier name</p>
                  </div>
                  <Switch
                    id="showCashier"
                    checked={formData.showCashier}
                    onCheckedChange={(checked) => setFormData({ ...formData, showCashier: checked })}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={updateSettings.isPending}>
                {updateSettings.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
              <Button type="button" variant="outline" onClick={() => setFormData(settings?.receipt || formData)}>
                Reset
              </Button>
              <Button type="button" variant="outline" onClick={() => toast({ title: 'Preview', description: 'Receipt preview coming soon' })}>
                Preview Receipt
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReceiptSettingsPage;
