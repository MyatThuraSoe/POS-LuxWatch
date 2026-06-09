// Customer Types
export interface Customer {
  id: number;
  name: string;
  email?: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  notes?: string;
  totalPurchases?: number;
  totalSpent?: number;
  loyaltyPoints?: number;
  tags?: string[];
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface CustomerCreateInput {
  name: string;
  email?: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  notes?: string;
  tags?: string[];
}

export interface CustomerUpdateInput extends Partial<CustomerCreateInput> {}

export interface CustomerStats {
  totalCustomers: number;
  newThisMonth: number;
  topSpenders: Customer[];
}

export interface CustomerPurchase {
  id: number;
  receiptNumber: string;
  date: string;
  total: number;
  items: number;
}
