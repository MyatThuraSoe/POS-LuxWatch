// Sales Types

export interface Sale {
  id: number;
  receiptNumber: string;
  customerId?: number;
  customerName?: string;
  items: SaleItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paymentMethod: 'cash' | 'card' | 'mixed' | 'wallet';
  status: 'completed' | 'refunded' | 'partial_refund';
  createdAt: string;
  createdBy: number;
  createdByName: string;
  notes?: string;
}

export interface SaleItem {
  id: number;
  productId: number;
  productName: string;
  productSku: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  tax: number;
  total: number;
}

export interface RefundData {
  saleId: number;
  items: RefundItem[];
  reason: string;
  refundMethod: 'cash' | 'card' | 'store_credit';
  notes?: string;
}

export interface RefundItem {
  saleItemId: number;
  productId: number;
  quantity: number;
  refundAmount: number;
}

export interface SalesFilters {
  dateFrom?: string;
  dateTo?: string;
  customerId?: number;
  paymentMethod?: string;
  status?: string;
  searchQuery?: string;
}

export interface TodaySummary {
  totalSales: number;
  totalRevenue: number;
  totalItems: number;
  averageOrderValue: number;
  salesByPaymentMethod: Record<string, number>;
  topProducts: Array<{ productId: number; name: string; quantity: number; revenue: number }>;
}
