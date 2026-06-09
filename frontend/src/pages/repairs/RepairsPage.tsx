import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Clock, CheckCircle, XCircle, AlertTriangle, Wrench } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Repair {
  id: number;
  customerName: string;
  productName: string;
  serialNumber: string;
  issue: string;
  status: 'pending' | 'in-progress' | 'waiting-parts' | 'completed' | 'delivered';
  createdAt: string;
  expectedCompletion: string;
  actualCompletion?: string;
  notes: string;
  slaStatus: 'on-track' | 'warning' | 'overdue';
}

const RepairsPage: React.FC = () => {
  const [repairs, setRepairs] = useState<Repair[]>([
    { id: 1, customerName: 'John Doe', productName: 'Rolex Submariner', serialNumber: 'RX123456', issue: 'Watch running slow, needs regulation', status: 'in-progress', createdAt: '2024-01-10', expectedCompletion: '2024-01-20', notes: 'Customer requested express service', slaStatus: 'on-track' },
    { id: 2, customerName: 'Jane Smith', productName: 'Apple Watch Ultra', serialNumber: 'AW789012', issue: 'Screen cracked, not responding to touch', status: 'waiting-parts', createdAt: '2024-01-08', expectedCompletion: '2024-01-18', notes: 'Waiting for replacement screen', slaStatus: 'warning' },
    { id: 3, customerName: 'Bob Wilson', productName: 'Omega Seamaster', serialNumber: 'OM345678', issue: 'Water damage, crown stuck', status: 'pending', createdAt: '2024-01-15', expectedCompletion: '2024-01-25', notes: '', slaStatus: 'on-track' },
    { id: 4, customerName: 'Alice Brown', productName: 'Samsung Galaxy Watch', serialNumber: 'SG901234', issue: 'Battery draining quickly', status: 'completed', createdAt: '2024-01-05', expectedCompletion: '2024-01-12', actualCompletion: '2024-01-11', notes: 'Battery replaced', slaStatus: 'on-track' },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { toast } = useToast();

  const filteredRepairs = repairs.filter(repair => {
    const matchesSearch = repair.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      repair.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      repair.serialNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || repair.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: Repair['status']) => {
    const variants = {
      'pending': 'secondary',
      'in-progress': 'default',
      'waiting-parts': 'warning' as any,
      'completed': 'success' as any,
      'delivered': 'outline'
    };
    return <Badge variant={variants[status]}>{status.replace('-', ' ')}</Badge>;
  };

  const getSLAIndicator = (slaStatus: Repair['slaStatus']) => {
    const config = {
      'on-track': { icon: CheckCircle, color: 'text-green-500', label: 'On Track' },
      'warning': { icon: AlertTriangle, color: 'text-yellow-500', label: 'Warning' },
      'overdue': { icon: XCircle, color: 'text-red-500', label: 'Overdue' }
    };
    const { icon: Icon, color, label } = config[slaStatus];
    return (
      <div className={`flex items-center gap-1 ${color}`}>
        <Icon className="h-4 w-4" />
        <span className="text-xs">{label}</span>
      </div>
    );
  };

  const updateStatus = (id: number, newStatus: Repair['status']) => {
    setRepairs(repairs.map(r => r.id === id ? { ...r, status: newStatus } : r));
    toast({ title: "Status Updated", description: `Repair #${id} marked as ${newStatus}` });
  };

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl">Repair Management</CardTitle>
            <Button onClick={() => toast({ title: "Info", description: "Create repair dialog coming soon" })}>
              <Wrench className="mr-2 h-4 w-4" /> New Repair Job
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by customer, product, or serial..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="p-2 border rounded-md"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="waiting-parts">Waiting Parts</option>
              <option value="completed">Completed</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Serial</TableHead>
                <TableHead>Issue</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>SLA</TableHead>
                <TableHead>Expected</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRepairs.map((repair) => (
                <TableRow key={repair.id}>
                  <TableCell className="font-medium">#{repair.id}</TableCell>
                  <TableCell>{repair.customerName}</TableCell>
                  <TableCell>{repair.productName}</TableCell>
                  <TableCell className="font-mono text-sm">{repair.serialNumber}</TableCell>
                  <TableCell className="max-w-xs truncate">{repair.issue}</TableCell>
                  <TableCell>{getStatusBadge(repair.status)}</TableCell>
                  <TableCell>{getSLAIndicator(repair.slaStatus)}</TableCell>
                  <TableCell>{repair.expectedCompletion}</TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {repair.status === 'pending' && (
                        <Button size="sm" variant="outline" onClick={() => updateStatus(repair.id, 'in-progress')}>
                          Start
                        </Button>
                      )}
                      {repair.status === 'in-progress' && (
                        <Button size="sm" variant="outline" onClick={() => updateStatus(repair.id, 'completed')}>
                          Complete
                        </Button>
                      )}
                      {repair.status === 'completed' && (
                        <Button size="sm" variant="outline" onClick={() => updateStatus(repair.id, 'delivered')}>
                          Deliver
                        </Button>
                      )}
                      <Button size="sm" variant="ghost" onClick={() => toast({ title: "Info", description: "View details coming soon" })}>
                        View
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

export default RepairsPage;
