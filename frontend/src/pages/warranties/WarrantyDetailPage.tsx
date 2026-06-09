import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, CheckCircle, Clock, AlertCircle, FileText } from 'lucide-react';

const WarrantyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Mock data
  const warranty = {
    id: Number(id),
    serialNumber: 'SN-2024-001',
    productName: 'Apple Watch Series 9',
    productSku: 'AW-S9-45MM',
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    customerPhone: '+1234567890',
    purchaseDate: '2024-01-15',
    purchaseReceiptNumber: 'RCT-2024-001',
    warrantyStartDate: '2024-01-15',
    warrantyEndDate: '2025-01-15',
    durationMonths: 12,
    status: 'active' as const,
    terms: '1 year manufacturer warranty covering defects in materials and workmanship.',
    notes: '',
    claimHistory: [
      {
        id: 1,
        claimDate: '2024-02-01',
        issueDescription: 'Screen not responding to touch',
        resolution: 'Screen replaced under warranty',
        status: 'completed' as const,
        technicianNotes: 'Defective screen unit replaced with new one',
        coveredAmount: 150.00,
        completedAt: '2024-02-05'
      }
    ]
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" /> Active</Badge>;
      case 'expired':
        return <Badge variant="default"><Clock className="h-3 w-3 mr-1" /> Expired</Badge>;
      case 'claimed':
        return <Badge variant="danger"><FileText className="h-3 w-3 mr-1" /> Claimed</Badge>;
      case 'void':
        return <Badge variant="default"><AlertCircle className="h-3 w-3 mr-1" /> Void</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getClaimStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      case 'pending':
        return <Badge variant="default"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>;
      case 'approved':
        return <Badge className="bg-blue-500">Approved</Badge>;
      case 'rejected':
        return <Badge variant="danger">Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/warranties')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <div className="flex-1" />
        {warranty.status === 'active' && (
          <Button onClick={() => navigate('/warranties/claim')}>
            File Claim
          </Button>
        )}
      </div>

      <div className="grid gap-6">
        {/* Warranty Info */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">{warranty.productName}</CardTitle>
                <p className="text-muted-foreground">{warranty.productSku}</p>
              </div>
              {getStatusBadge(warranty.status)}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <h4 className="font-medium mb-2">Serial Number</h4>
                <p className="text-muted-foreground">{warranty.serialNumber}</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Purchase Date</h4>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {warranty.purchaseDate}
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Receipt Number</h4>
                <p className="text-muted-foreground">{warranty.purchaseReceiptNumber}</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-medium mb-2">Warranty Period</h4>
                <p className="text-sm">
                  <span className="text-muted-foreground">From:</span> {warranty.warrantyStartDate}
                </p>
                <p className="text-sm">
                  <span className="text-muted-foreground">To:</span> {warranty.warrantyEndDate}
                </p>
                <p className="text-sm">
                  <span className="text-muted-foreground">Duration:</span> {warranty.durationMonths} months
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Customer Information</h4>
                <p className="text-sm">{warranty.customerName}</p>
                <p className="text-sm text-muted-foreground">{warranty.customerEmail}</p>
                <p className="text-sm text-muted-foreground">{warranty.customerPhone}</p>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Terms & Conditions</h4>
              <p className="text-sm text-muted-foreground">{warranty.terms}</p>
            </div>
          </CardContent>
        </Card>

        {/* Claim History */}
        {warranty.claimHistory && warranty.claimHistory.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Claim History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {warranty.claimHistory.map((claim) => (
                  <div key={claim.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">Claim #{claim.id}</p>
                        <p className="text-sm text-muted-foreground">{claim.claimDate}</p>
                      </div>
                      {getClaimStatusBadge(claim.status)}
                    </div>
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm font-medium">Issue</p>
                        <p className="text-sm text-muted-foreground">{claim.issueDescription}</p>
                      </div>
                      {claim.resolution && (
                        <div>
                          <p className="text-sm font-medium">Resolution</p>
                          <p className="text-sm text-muted-foreground">{claim.resolution}</p>
                        </div>
                      )}
                      {claim.technicianNotes && (
                        <div>
                          <p className="text-sm font-medium">Technician Notes</p>
                          <p className="text-sm text-muted-foreground">{claim.technicianNotes}</p>
                        </div>
                      )}
                      {claim.coveredAmount && (
                        <div>
                          <p className="text-sm font-medium">Covered Amount</p>
                          <p className="text-sm">${claim.coveredAmount.toFixed(2)}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default WarrantyDetailPage;
