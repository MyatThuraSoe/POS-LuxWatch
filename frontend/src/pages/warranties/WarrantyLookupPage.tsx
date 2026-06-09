import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Search, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const WarrantyLookupPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [lookupType, setLookupType] = useState<'serial' | 'receipt'>('serial');
  const [searchValue, setSearchValue] = useState('');
  const [result, setResult] = useState<any>(null);

  const handleLookup = () => {
    // Mock lookup - in real app, call API
    if (searchValue.trim()) {
      setResult({
        id: 1,
        serialNumber: searchValue || 'SN-2024-001',
        productName: 'Apple Watch Series 9',
        productSku: 'AW-S9-45MM',
        customerName: 'John Doe',
        purchaseDate: '2024-01-15',
        purchaseReceiptNumber: 'RCT-2024-001',
        warrantyStartDate: '2024-01-15',
        warrantyEndDate: '2025-01-15',
        durationMonths: 12,
        status: 'active' as const,
        terms: '1 year manufacturer warranty covering defects in materials and workmanship.',
      });
    } else {
      toast({ title: "Error", description: "Please enter a serial number or receipt number", variant: "destructive" });
    }
  };

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/warranties')}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <CardTitle className="text-2xl">Warranty Lookup</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-4">
            <Button
              variant={lookupType === 'serial' ? 'default' : 'outline'}
              onClick={() => setLookupType('serial')}
            >
              Lookup by Serial Number
            </Button>
            <Button
              variant={lookupType === 'receipt' ? 'default' : 'outline'}
              onClick={() => setLookupType('receipt')}
            >
              Lookup by Receipt Number
            </Button>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="search">
                {lookupType === 'serial' ? 'Serial Number' : 'Receipt Number'} *
              </Label>
              <Input
                id="search"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder={lookupType === 'serial' ? 'Enter serial number...' : 'Enter receipt number...'}
                onKeyDown={(e) => e.key === 'Enter' && handleLookup()}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleLookup}>
                <Search className="mr-2 h-4 w-4" /> Lookup
              </Button>
            </div>
          </div>

          {result && (
            <div className="mt-6 border rounded-lg p-6 bg-muted/50">
              <div className="flex items-center gap-2 mb-4">
                {result.status === 'active' ? (
                  <CheckCircle className="h-6 w-6 text-green-500" />
                ) : result.status === 'expired' ? (
                  <Clock className="h-6 w-6 text-orange-500" />
                ) : (
                  <AlertCircle className="h-6 w-6 text-red-500" />
                )}
                <h3 className="text-xl font-semibold">
                  Warranty Status: <span className="capitalize">{result.status}</span>
                </h3>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-medium mb-2">Product Information</h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-muted-foreground">Product:</span> {result.productName}</p>
                    <p><span className="text-muted-foreground">SKU:</span> {result.productSku}</p>
                    <p><span className="text-muted-foreground">Serial:</span> {result.serialNumber}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Purchase Information</h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-muted-foreground">Customer:</span> {result.customerName}</p>
                    <p><span className="text-muted-foreground">Receipt:</span> {result.purchaseReceiptNumber}</p>
                    <p><span className="text-muted-foreground">Purchase Date:</span> {result.purchaseDate}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Warranty Period</h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-muted-foreground">Start Date:</span> {result.warrantyStartDate}</p>
                    <p><span className="text-muted-foreground">End Date:</span> {result.warrantyEndDate}</p>
                    <p><span className="text-muted-foreground">Duration:</span> {result.durationMonths} months</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Terms</h4>
                  <p className="text-sm text-muted-foreground">{result.terms}</p>
                </div>
              </div>

              <div className="mt-6 flex gap-2">
                {result.status === 'active' && (
                  <Button onClick={() => navigate('/warranties/claim')}>
                    File Claim
                  </Button>
                )}
                <Button variant="primary" onClick={() => navigate(`/warranties/${result.id}`)}>
                  View Details
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WarrantyLookupPage;
