import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Store, CreditCard, FileText, Printer, Barcode, User, Settings, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('shop');
  const { toast } = useToast();

  // Mock settings data
  const [shopSettings, setShopSettings] = useState({
    name: 'LuxWatch Store',
    address: '123 Main Street, City, State 12345',
    phone: '+1 (555) 123-4567',
    email: 'contact@luxwatch.com',
    logo: '',
    currency: 'USD',
    timezone: 'UTC'
  });

  const [taxSettings, setTaxSettings] = useState({
    taxRate: 8.5,
    taxIncluded: false,
    taxNumber: 'TAX-123456789'
  });

  const [receiptSettings, setReceiptSettings] = useState({
    header: 'Thank you for shopping with us!',
    footer: 'Visit us again soon!',
    showLogo: true,
    showBarcode: true,
    paperSize: '80mm'
  });

  const handleSave = (section: string) => {
    toast({ title: "Settings Saved", description: `${section} settings updated successfully` });
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
          <TabsTrigger value="shop" className="flex items-center gap-2">
            <Store className="h-4 w-4" />
            <span className="hidden sm:inline">Shop</span>
          </TabsTrigger>
          <TabsTrigger value="tax" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">Tax</span>
          </TabsTrigger>
          <TabsTrigger value="receipts" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Receipts</span>
          </TabsTrigger>
          <TabsTrigger value="printers" className="flex items-center gap-2">
            <Printer className="h-4 w-4" />
            <span className="hidden sm:inline">Printers</span>
          </TabsTrigger>
          <TabsTrigger value="barcodes" className="flex items-center gap-2">
            <Barcode className="h-4 w-4" />
            <span className="hidden sm:inline">Barcodes</span>
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Preferences</span>
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">System</span>
          </TabsTrigger>
          <TabsTrigger value="permissions" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Permissions</span>
          </TabsTrigger>
        </TabsList>

        {/* Shop Settings */}
        <TabsContent value="shop">
          <Card>
            <CardHeader>
              <CardTitle>Shop Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="shopName">Shop Name *</Label>
                  <Input
                    id="shopName"
                    value={shopSettings.name}
                    onChange={(e) => setShopSettings({ ...shopSettings, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={shopSettings.phone}
                    onChange={(e) => setShopSettings({ ...shopSettings, phone: e.target.value })}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={shopSettings.address}
                    onChange={(e) => setShopSettings({ ...shopSettings, address: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={shopSettings.email}
                    onChange={(e) => setShopSettings({ ...shopSettings, email: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <select
                    id="currency"
                    value={shopSettings.currency}
                    onChange={(e) => setShopSettings({ ...shopSettings, currency: e.target.value })}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>
              </div>
              <Button onClick={() => handleSave('Shop')}>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tax Settings */}
        <TabsContent value="tax">
          <Card>
            <CardHeader>
              <CardTitle>Tax Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="taxRate">Tax Rate (%)</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    step="0.1"
                    value={taxSettings.taxRate}
                    onChange={(e) => setTaxSettings({ ...taxSettings, taxRate: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <Label htmlFor="taxNumber">Tax ID Number</Label>
                  <Input
                    id="taxNumber"
                    value={taxSettings.taxNumber}
                    onChange={(e) => setTaxSettings({ ...taxSettings, taxNumber: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="taxIncluded"
                  checked={taxSettings.taxIncluded}
                  onChange={(e) => setTaxSettings({ ...taxSettings, taxIncluded: e.target.checked })}
                  className="h-4 w-4"
                />
                <Label htmlFor="taxIncluded">Prices include tax</Label>
              </div>
              <Button onClick={() => handleSave('Tax')}>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Receipt Settings */}
        <TabsContent value="receipts">
          <Card>
            <CardHeader>
              <CardTitle>Receipt Template Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="header">Header Text</Label>
                  <Input
                    id="header"
                    value={receiptSettings.header}
                    onChange={(e) => setReceiptSettings({ ...receiptSettings, header: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="footer">Footer Text</Label>
                  <Input
                    id="footer"
                    value={receiptSettings.footer}
                    onChange={(e) => setReceiptSettings({ ...receiptSettings, footer: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="paperSize">Paper Size</Label>
                  <select
                    id="paperSize"
                    value={receiptSettings.paperSize}
                    onChange={(e) => setReceiptSettings({ ...receiptSettings, paperSize: e.target.value })}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="80mm">80mm (Thermal)</option>
                    <option value="57mm">57mm (Thermal)</option>
                    <option value="A4">A4 (Standard)</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="showLogo"
                    checked={receiptSettings.showLogo}
                    onChange={(e) => setReceiptSettings({ ...receiptSettings, showLogo: e.target.checked })}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="showLogo">Show Logo</Label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="showBarcode"
                    checked={receiptSettings.showBarcode}
                    onChange={(e) => setReceiptSettings({ ...receiptSettings, showBarcode: e.target.checked })}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="showBarcode">Show Barcode</Label>
                </div>
              </div>
              <Button onClick={() => handleSave('Receipt')}>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Printers */}
        <TabsContent value="printers">
          <Card>
            <CardHeader>
              <CardTitle>Printer Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Configure your thermal and barcode printers here.</p>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">Receipt Printer</h3>
                    <Badge variant="default">Connected</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">EPSON TM-T20III - USB</p>
                  <Button size="sm" variant="outline" className="mt-2" onClick={() => toast({ title: "Test Print", description: "Sending test print..." })}>
                    Test Print
                  </Button>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">Barcode Printer</h3>
                    <Badge variant="default">Not Connected</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Zebra GK420d - Network</p>
                  <Button size="sm" variant="outline" className="mt-2" onClick={() => toast({ title: "Info", description: "Configure printer connection" })}>
                    Configure
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Barcodes */}
        <TabsContent value="barcodes">
          <Card>
            <CardHeader>
              <CardTitle>Barcode Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Configure barcode generation and scanning options.</p>
              <div className="mt-4 space-y-4">
                <div>
                  <Label>Barcode Format</Label>
                  <select className="w-full p-2 border rounded-md mt-1">
                    <option value="EAN13">EAN-13</option>
                    <option value="CODE128">Code 128</option>
                    <option value="QR">QR Code</option>
                  </select>
                </div>
                <Button onClick={() => handleSave('Barcode')}>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences */}
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>User Preferences</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Dark Mode</h3>
                    <p className="text-sm text-muted-foreground">Toggle dark theme</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => toast({ title: "Info", description: "Dark mode toggle coming soon" })}>
                    Toggle
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Language</h3>
                    <p className="text-sm text-muted-foreground">Select interface language</p>
                  </div>
                  <select className="p-2 border rounded-md">
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System */}
        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Advanced system configuration options.</p>
              <div className="mt-4 space-y-4">
                <Button variant="outline" onClick={() => toast({ title: "Info", description: "Backup feature coming soon" })}>
                  Backup Data
                </Button>
                <Button variant="outline" onClick={() => toast({ title: "Info", description: "Export feature coming soon" })}>
                  Export Settings
                </Button>
                <Button variant="danger" onClick={() => toast({ title: "Info", description: "Reset feature requires confirmation" })}>
                  Reset to Defaults
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Permissions */}
        <TabsContent value="permissions">
          <Card>
            <CardHeader>
              <CardTitle>Role Permissions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Manage user role permissions. Configure in User Management section.</p>
              <Button className="mt-4" onClick={() => toast({ title: "Info", description: "Navigate to User Management" })}>
                Go to User Management
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
