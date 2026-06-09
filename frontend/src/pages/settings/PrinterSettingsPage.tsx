import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useSettings, useUpdateSettings } from '@/hooks/useSettings';
import { Loader2, Printer, Wifi, Usb } from 'lucide-react';

import { PrinterSettings } from '@/types/settings';

const PrinterSettingsPage: React.FC = () => {
  const { toast } = useToast();
  const { data: settings, isLoading } = useSettings();
  const updateSettings = useUpdateSettings();

  const [formData, setFormData] = React.useState<PrinterSettings>({
    enabled: true,
    type: 'thermal',
    name: '',
    ip: '',
    port: 9100,
    autoPrint: true,
    printReceipt: true,
    printInvoice: false
  });

  React.useEffect(() => {
    if (settings?.printer) {
      setFormData(settings.printer);
    }
  }, [settings]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings.mutate(
      { printer: formData },
      {
        onSuccess: () => {
          toast({
            title: 'Printer Settings Saved',
            description: 'Your printer configuration has been updated successfully.'
          });
        },
        onError: () => {
          toast({
            title: 'Error',
            description: 'Failed to save printer settings.',
            variant: 'destructive'
          });
        }
      }
    );
  };

  const testPrint = () => {
    toast({
      title: 'Test Print',
      description: 'Sending test print to printer...'
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
        <h1 className="text-3xl font-bold">Printer Settings</h1>
        <p className="text-muted-foreground">Configure your receipt and label printers</p>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Primary Printer Configuration</CardTitle>
            <CardDescription>Set up your main receipt printer</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label htmlFor="enabled" className="font-medium">Enable Printing</Label>
                  <p className="text-sm text-muted-foreground">Toggle printer functionality</p>
                </div>
                <Switch
                  id="enabled"
                  checked={formData.enabled}
                  onCheckedChange={(checked) => setFormData({ ...formData, enabled: checked })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Printer Type</Label>
                  <select
                    id="type"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as 'thermal' | 'laser' | 'inkjet' })}
                    className="w-full p-2 border rounded-md"
                    disabled={!formData.enabled}
                  >
                    <option value="thermal">Thermal (Receipt)</option>
                    <option value="laser">Laser</option>
                    <option value="inkjet">Inkjet</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="name">Printer Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., EPSON TM-T20III"
                    disabled={!formData.enabled}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="ip">Printer IP Address</Label>
                  <Input
                    id="ip"
                    value={formData.ip}
                    onChange={(e) => setFormData({ ...formData, ip: e.target.value })}
                    placeholder="192.168.1.100"
                    disabled={!formData.enabled}
                  />
                </div>
                <div>
                  <Label htmlFor="port">Port</Label>
                  <Input
                    id="port"
                    type="number"
                    value={formData.port}
                    onChange={(e) => setFormData({ ...formData, port: parseInt(e.target.value) || 9100 })}
                    disabled={!formData.enabled}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label>Printing Options</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <Label htmlFor="autoPrint" className="font-medium">Auto Print</Label>
                      <p className="text-sm text-muted-foreground">Print automatically</p>
                    </div>
                    <Switch
                      id="autoPrint"
                      checked={formData.autoPrint}
                      onCheckedChange={(checked) => setFormData({ ...formData, autoPrint: checked })}
                      disabled={!formData.enabled}
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <Label htmlFor="printReceipt" className="font-medium">Print Receipts</Label>
                      <p className="text-sm text-muted-foreground">Enable receipt printing</p>
                    </div>
                    <Switch
                      id="printReceipt"
                      checked={formData.printReceipt}
                      onCheckedChange={(checked) => setFormData({ ...formData, printReceipt: checked })}
                      disabled={!formData.enabled}
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <Label htmlFor="printInvoice" className="font-medium">Print Invoices</Label>
                      <p className="text-sm text-muted-foreground">Enable invoice printing</p>
                    </div>
                    <Switch
                      id="printInvoice"
                      checked={formData.printInvoice}
                      onCheckedChange={(checked) => setFormData({ ...formData, printInvoice: checked })}
                      disabled={!formData.enabled}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={updateSettings.isPending || !formData.enabled}>
                  {updateSettings.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
                <Button type="button" variant="outline" onClick={() => setFormData(settings?.printer || formData)} disabled={!formData.enabled}>
                  Reset
                </Button>
                <Button type="button" variant="outline" onClick={testPrint} disabled={!formData.enabled}>
                  <Printer className="mr-2 h-4 w-4" />
                  Test Print
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Connected Printers</CardTitle>
            <CardDescription>Manage all connected printers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Usb className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Receipt Printer</h3>
                    <p className="text-sm text-muted-foreground">EPSON TM-T20III - USB Connection</p>
                  </div>
                </div>
                <Badge variant="default" className="flex items-center gap-1">
                  <Wifi className="h-3 w-3" />
                  Connected
                </Badge>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted rounded-lg">
                    <Printer className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-medium">Barcode Printer</h3>
                    <p className="text-sm text-muted-foreground">Zebra GK420d - Network</p>
                  </div>
                </div>
                <Badge variant="default">Not Configured</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrinterSettingsPage;
