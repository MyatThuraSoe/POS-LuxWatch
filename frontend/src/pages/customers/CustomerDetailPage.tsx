import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Mail, Phone, MapPin, ShoppingCart, Star } from 'lucide-react';
import { useCustomers } from '@/hooks/useCustomers';
import { Skeleton } from '@/components/ui/skeleton';

const CustomerDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  // In a real app, we'd fetch the customer by ID
  // For now, using mock data
  const customer = {
    id: Number(id),
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    address: '123 Main St, New York, NY 10001',
    tags: ['VIP', 'Regular'],
    totalPurchases: 15,
    totalSpent: 2450.00,
    loyaltyPoints: 245,
    status: 'active' as const,
    createdAt: '2023-06-15T10:30:00Z',
    updatedAt: '2024-01-15T14:20:00Z',
  };

  const recentPurchases = [
    { id: 1, receiptNumber: 'RCT-2024-001', date: '2024-01-15', total: 150.00, items: 2 },
    { id: 2, receiptNumber: 'RCT-2024-002', date: '2024-01-10', total: 89.99, items: 1 },
    { id: 3, receiptNumber: 'RCT-2024-003', date: '2024-01-05', total: 245.50, items: 3 },
  ];

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/customers')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <div className="flex-1" />
        <Button variant="outline" onClick={() => navigate(`/customers/${id}/edit`)}>
          <Edit className="mr-2 h-4 w-4" /> Edit
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Customer Info */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-2xl">{customer.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{customer.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{customer.phone}</span>
              </div>
              <div className="flex items-center gap-2 sm:col-span-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{customer.address}</span>
              </div>
            </div>

            <div className="flex gap-2 flex-wrap">
              {customer.tags.map((tag, i) => (
                <Badge key={i} variant="default">{tag}</Badge>
              ))}
              <Badge variant={customer.status === 'active' ? 'default' : 'secondary'}>
                {customer.status}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                <span>Total Purchases</span>
              </div>
              <span className="font-semibold">{customer.totalPurchases}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Total Spent</span>
              <span className="font-semibold">${customer.totalSpent.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-muted-foreground" />
                <span>Loyalty Points</span>
              </div>
              <span className="font-semibold">{customer.loyaltyPoints}</span>
            </div>
          </CardContent>
        </Card>

        {/* Recent Purchases */}
        <Card className="md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Purchases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-3 text-left font-medium">Receipt #</th>
                    <th className="p-3 text-left font-medium">Date</th>
                    <th className="p-3 text-left font-medium">Items</th>
                    <th className="p-3 text-right font-medium">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPurchases.map((purchase) => (
                    <tr key={purchase.id} className="border-b last:border-0">
                      <td className="p-3">{purchase.receiptNumber}</td>
                      <td className="p-3">{purchase.date}</td>
                      <td className="p-3">{purchase.items}</td>
                      <td className="p-3 text-right">${purchase.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CustomerDetailPage;
