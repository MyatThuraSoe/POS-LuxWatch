import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, FileText, Eye, Printer } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Receipt {
  id: number;
  receiptNumber: string;
  date: string;
  customerName: string;
  total: number;
  paymentMethod: string;
  status: 'printed' | 'pending' | 'emailed';
}

const ReceiptsPage: React.FC = () => {
  const [receipts, setReceipts] = useState<Receipt[]>([
    { id: 1, receiptNumber: 'RCP-2024-001', date: '2024-01-15 10:30', customerName: 'John Doe', total: 1299.99, paymentMethod: 'Credit Card', status: 'printed' },
    { id: 2, receiptNumber: 'RCP-2024-002', date: '2024-01-15 11:45', customerName: 'Jane Smith', total: 599.99, paymentMethod: 'Cash', status: 'printed' },
    { id: 3, receiptNumber: 'RCP-2024-003', date: '2024-01-15 14:20', customerName: 'Bob Wilson', total: 2499.99, paymentMethod: 'Debit Card', status: 'pending' },
    { id: 4, receiptNumber: 'RCP-2024-004', date: '2024-01-15 16:00', customerName: 'Alice Brown', total: 899.99, paymentMethod: 'Credit Card', status: 'emailed' },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const filteredReceipts = receipts.filter(receipt =>
    receipt.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    receipt.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePrint = (id: number) => {
    toast({ title: "Printing", description: `Receipt #${id} sent to printer` });
    setReceipts(receipts.map(r => r.id === id ? { ...r, status: 'printed' as const } : r));
  };

  const handleView = (id: number) => {
    toast({ title: "Info", description: `View receipt #${id} - Full view coming soon` });
  };

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl">Receipts Management</CardTitle>
            <Button variant="outline" onClick={() => toast({ title: "Info", description: "Template editor coming soon" })}>
              <FileText className="mr-2 h-4 w-4" /> Manage Templates
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by receipt number or customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Receipt #</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReceipts.map((receipt) => (
                <TableRow key={receipt.id}>
                  <TableCell className="font-medium">{receipt.receiptNumber}</TableCell>
                  <TableCell>{receipt.date}</TableCell>
                  <TableCell>{receipt.customerName}</TableCell>
                  <TableCell>{receipt.paymentMethod}</TableCell>
                  <TableCell>${receipt.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={
                      receipt.status === 'printed' ? 'default' :
                      receipt.status === 'pending' ? 'secondary' : 'outline'
                    }>
                      {receipt.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleView(receipt.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handlePrint(receipt.id)}
                      >
                        <Printer className="h-4 w-4" />
                      </Button>
                    </div>
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

export default ReceiptsPage;
