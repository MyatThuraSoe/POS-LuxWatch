import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useSettings, useUpdateSettings } from '@/hooks/useSettings';
import { Loader2, Barcode } from 'lucide-react';

const BarcodeSettingsPage: React.FC = () => {
  const { toast } = useToast();
  const { data: settings, isLoading } = useSettings();
  const updateSettings = useUpdateSettings();

  const [formData, setFormData] = React.useState({
    enabled: true,
    prefix: '',
    suffix: '',
    generator: 'ean13' as 'ean13' | 'code128' | 'upc',
    printOnCreate: true
  });

  React.useEffect(() => {
    if (settings?.barcode) {
      setFormData(settings.barcode);
    }
  }, [settings]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings.mutate(
      { barcode: formData },
      {
        onSuccess: () => {
          toast({
            title: 'Barcode Settings Saved',
            description: 'Your barcode configuration has been updated successfully.'
          });
        },
        onError: () => {
          toast({
            title: 'Error',
            description: 'Failed to save barcode settings.',
            variant: 'destructive'
          });
        }
      }
    );
  };

  const generateTestBarcode = () => {
    toast({
      title: 'Test Barcode',
      description: `Generated test barcode with ${formData.generator} format`
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
        <h1 className="text-3xl font-bold">Barcode Settings</h1>
        <p className="text-muted-foreground">Configure barcode generation and scanning options</p>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Barcode Generation</CardTitle>
            <CardDescription>Set up barcode format and rules</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label htmlFor="enabled" className="font-medium">Enable Barcodes</Label>
                  <p className="text-sm text-muted-foreground">Generate barcodes for products</p>
                </div>
                <Switch
                  id="enabled"
                  checked={formData.enabled}
                  onCheckedChange={(checked) => setFormData({ ...formData, enabled: checked })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="generator">Barcode Format *</Label>
                  <select
                    id="generator"
                    value={formData.generator}
                    onChange={(e) => setFormData({ ...formData, generator: e.target.value as 'ean13' | 'code128' | 'upc' })}
                    className="w-full p-2 border rounded-md"
                    disabled={!formData.enabled}
                  >
                    <option value="ean13">EAN-13 (International Standard)</option>
                    <option value="code128">Code 128 (Alphanumeric)</option>
                    <option value="upc">UPC-A (North America)</option>
                  </select>
                  <p className="text-sm text-muted-foreground mt-1">
                    {formData.generator === 'ean13' && '13-digit international product numbering system'}
                    {formData.generator === 'code128' && 'Supports letters, numbers, and special characters'}
                    {formData.generator === 'upc' && '12-digit Universal Product Code used in North America'}
                  </p>
                </div>
                <div className="flex items-end">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={generateTestBarcode}
                    disabled={!formData.enabled}
                    className="w-full"
                  >
                    <Barcode className="mr-2 h-4 w-4" />
                    Generate Test Barcode
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="prefix">Barcode Prefix</Label>
                  <Input
                    id="prefix"
                    value={formData.prefix}
                    onChange={(e) => setFormData({ ...formData, prefix: e.target.value })}
                    placeholder="e.g., 20"
                    disabled={!formData.enabled}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Optional prefix added to all generated barcodes
                  </p>
                </div>
                <div>
                  <Label htmlFor="suffix">Barcode Suffix</Label>
                  <Input
                    id="suffix"
                    value={formData.suffix}
                    onChange={(e) => setFormData({ ...formData, suffix: e.target.value })}
                    placeholder="e.g., 00"
                    disabled={!formData.enabled}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Optional suffix added to all generated barcodes
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label htmlFor="printOnCreate" className="font-medium">Auto-print on Create</Label>
                  <p className="text-sm text-muted-foreground">Print barcode labels when creating products</p>
                </div>
                <Switch
                  id="printOnCreate"
                  checked={formData.printOnCreate}
                  onCheckedChange={(checked) => setFormData({ ...formData, printOnCreate: checked })}
                  disabled={!formData.enabled}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={updateSettings.isPending || !formData.enabled}>
                  {updateSettings.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setFormData(settings?.barcode || formData)}
                  disabled={!formData.enabled}
                >
                  Reset
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Barcode Scanner</CardTitle>
            <CardDescription>Configure barcode scanner settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg bg-muted/50">
                <h3 className="font-medium mb-2">Scanner Status</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Most USB barcode scanners work automatically as keyboard input devices. 
                  Simply connect your scanner and start scanning.
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span>Scanner ready - Auto-detect enabled</span>
                </div>
              </div>
              <Button variant="outline" onClick={() => toast({ title: 'Info', description: 'Scanner calibration coming soon' })}>
                Calibrate Scanner
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BarcodeSettingsPage;
