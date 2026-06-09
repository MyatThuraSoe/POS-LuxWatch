import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Eye, FilePlus, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const WarrantiesPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Mock data
  const warranties = [
    { 
      id: 1, 
      serialNumber: 'SN-2024-001', 
      productName: 'Apple Watch Series 9', 
      productSku: 'AW-S9-45MM', 
      customerName: 'John Doe', 
      purchaseDate: '2024-01-15', 
      warrantyEndDate: '2025-01-15', 
      status: 'active' as const,
      durationMonths: 12
    },
    { 
      id: 2, 
      serialNumber: 'SN-2024-002', 
      productName: 'Samsung Galaxy S24', 
      productSku: 'SG-S24-256', 
      customerName: 'Jane Smith', 
      purchaseDate: '2023-06-10', 
      warrantyEndDate: '2024-06-10', 
      status: 'expired' as const,
      durationMonths: 12
    },
    { 
      id: 3, 
      serialNumber: 'SN-2024-003', 
      productName: 'Sony WH-1000XM5', 
      productSku: 'SONY-WH1000XM5', 
      customerName: 'Bob Wilson', 
      purchaseDate: '2024-01-05', 
      warrantyEndDate: '2026-01-05', 
      status: 'claimed' as const,
      durationMonths: 24
    },
  ];

  const filteredWarranties = warranties.filter(w => {
    const matchesSearch = w.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         w.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         w.customerName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || w.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" /> Active</Badge>;
      case 'expired':
        return <Badge variant="default"><Clock className="h-3 w-3 mr-1" /> Expired</Badge>;
      case 'claimed':
        return <Badge variant="danger"><FilePlus className="h-3 w-3 mr-1" /> Claimed</Badge>;
      case 'void':
        return <Badge variant="default"><XCircle className="h-3 w-3 mr-1" /> Void</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl">Warranty Management</CardTitle>
            <div className="flex gap-2">
              <Button onClick={() => navigate('/warranties/lookup')}>
                <Search className="mr-2 h-4 w-4" /> Lookup Warranty
              </Button>
              <Button onClick={() => navigate('/warranties/claim')}>
                <FilePlus className="mr-2 h-4 w-4" /> New Claim
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by serial, product, or customer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="p-2 border rounded-md"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="claimed">Claimed</option>
              <option value="void">Void</option>
            </select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Serial Number</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Purchase Date</TableHead>
                <TableHead>Warranty End</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredWarranties.map((warranty) => (
                <TableRow key={warranty.id}>
                  <TableCell className="font-medium">{warranty.serialNumber}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{warranty.productName}</div>
                      <div className="text-sm text-muted-foreground">{warranty.productSku}</div>
                    </div>
                  </TableCell>
                  <TableCell>{warranty.customerName || 'N/A'}</TableCell>
                  <TableCell>{warranty.purchaseDate}</TableCell>
                  <TableCell>{warranty.warrantyEndDate}</TableCell>
                  <TableCell>{warranty.durationMonths} months</TableCell>
                  <TableCell>{getStatusBadge(warranty.status)}</TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => navigate(`/warranties/${warranty.id}`)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default WarrantiesPage;
