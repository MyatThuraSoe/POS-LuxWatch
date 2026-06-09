// Warranty Types
export interface Warranty {
  id: number;
  serialNumber: string;
  productId: number;
  productName: string;
  productSku: string;
  customerId?: number;
  customerName?: string;
  purchaseDate: string;
  purchaseReceiptNumber: string;
  warrantyStartDate: string;
  warrantyEndDate: string;
  durationMonths: number;
  status: 'active' | 'expired' | 'claimed' | 'void';
  claimHistory?: WarrantyClaim[];
  terms?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WarrantyClaim {
  id: number;
  warrantyId: number;
  claimDate: string;
  issueDescription: string;
  resolution?: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  technicianNotes?: string;
  repairCost?: number;
  coveredAmount?: number;
  completedAt?: string;
}

export interface WarrantyClaimInput {
  warrantyId: number;
  issueDescription: string;
  customerNotes?: string;
}

export interface WarrantyLookupInput {
  serialNumber?: string;
  receiptNumber?: string;
  productId?: number;
}

export interface WarrantyStats {
  totalWarranties: number;
  activeWarranties: number;
  expiringSoon: number;
  claimsThisMonth: number;
}
