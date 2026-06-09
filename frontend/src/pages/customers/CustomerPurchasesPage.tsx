import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

const CustomerPurchasesPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Mock data
  const customer = { name: 'John Doe' };
  
  const purchases = [
    { 
      id: 1, 
      receiptNumber: 'RCT-2024-001', 
      date: '2024-01-15', 
      total: 150.00, 
      items: 2,
      status: 'completed',
      paymentMethod: 'card'
    },
    { 
      id: 2, 
      receiptNumber: 'RCT-2024-002', 
      date: '2024-01-10', 
      total: 89.99, 
      items: 1,
      status: 'completed',
      paymentMethod: 'cash'
    },
    { 
      id: 3, 
      receiptNumber: 'RCT-2024-003', 
      date: '2024-01-05', 
      total: 245.50, 
      items: 3,
      status: 'refunded',
      paymentMethod: 'card'
    },
  ];

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate(`/customers/${id}`)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Customer
        </Button>
        <div className="flex-1" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            Purchase History - {customer.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-3 text-left font-medium">Receipt #</th>
                  <th className="p-3 text-left font-medium">Date</th>
                  <th className="p-3 text-left font-medium">Items</th>
                  <th className="p-3 text-left font-medium">Payment</th>
                  <th className="p-3 text-left font-medium">Status</th>
                  <th className="p-3 text-right font-medium">Total</th>
                  <th className="p-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {purchases.map((purchase) => (
                  <tr key={purchase.id} className="border-b last:border-0 hover:bg-muted/50">
                    <td className="p-3 font-medium">{purchase.receiptNumber}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {purchase.date}
                      </div>
                    </td>
                    <td className="p-3">{purchase.items}</td>
                    <td className="p-3 capitalize">{purchase.paymentMethod}</td>
                    <td className="p-3">
                      <Badge 
                        variant={purchase.status === 'completed' ? 'default' : 'secondary'}
                        className="flex items-center gap-1 w-fit"
                      >
                        {purchase.status === 'completed' ? (
                          <CheckCircle2 className="h-3 w-3" />
                        ) : (
                          <AlertCircle className="h-3 w-3" />
                        )}
                        {purchase.status}
                      </Badge>
                    </td>
                    <td className="p-3 text-right font-semibold">
                      ${purchase.total.toFixed(2)}
                    </td>
                    <td className="p-3 text-right">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/sales/${purchase.id}`)}
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Total Purchases: {purchases.length} | Total Spent: ${purchases.reduce((sum, p) => sum + p.total, 0).toFixed(2)}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerPurchasesPage;
