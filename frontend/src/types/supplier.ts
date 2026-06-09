// Supplier Types

export interface Supplier {
  id: number;
  name: string;
  code?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  fax?: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  taxNumber?: string;
  currency?: string;
  paymentTerms?: string;
  creditLimit?: number;
  notes?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface SupplierContact {
  id: number;
  supplierId: number;
  name: string;
  title?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  isPrimary: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SupplierPurchaseHistory {
  supplierId: number;
  totalOrders: number;
  totalAmount: number;
  averageOrderValue: number;
  lastOrderDate?: string;
  orders: PurchaseOrderSummary[];
}

export interface PurchaseOrderSummary {
  id: number;
  orderNumber: string;
  status: 'draft' | 'pending' | 'approved' | 'partially_received' | 'received' | 'cancelled';
  totalAmount: number;
  createdAt: string;
}

export type SupplierFormData = Omit<
  Supplier,
  'id' | 'createdAt' | 'updatedAt' | 'status'
> & {
  status?: 'active' | 'inactive';
};

export const SUPPLIER_STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
] as const;
