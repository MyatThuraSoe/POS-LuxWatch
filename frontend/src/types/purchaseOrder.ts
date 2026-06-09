// Purchase Order Types

export type PurchaseOrderStatus = 
  | 'draft' 
  | 'pending' 
  | 'approved' 
  | 'partially_received' 
  | 'received' 
  | 'cancelled';

export interface PurchaseOrder {
  id: number;
  orderNumber: string;
  supplierId: number;
  supplierName: string;
  status: PurchaseOrderStatus;
  orderDate: string;
  expectedDeliveryDate?: string;
  receivedDate?: string;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  shippingCost: number;
  totalAmount: number;
  notes?: string;
  internalNotes?: string;
  approvedBy?: number;
  approvedByName?: string;
  approvedAt?: string;
  receivedBy?: number;
  receivedByName?: string;
  createdAt: string;
  updatedAt: string;
  items: PurchaseOrderItem[];
}

export interface PurchaseOrderItem {
  id?: number;
  productId: number;
  productName: string;
  productSku?: string;
  quantityOrdered: number;
  quantityReceived: number;
  quantityPending: number;
  unitPrice: number;
  taxRate?: number;
  taxAmount: number;
  discountAmount: number;
  totalPrice: number;
  notes?: string;
}

export interface PurchaseOrderFormData {
  supplierId: number;
  orderDate: string;
  expectedDeliveryDate?: string;
  notes?: string;
  internalNotes?: string;
  items: PurchaseOrderItemData[];
}

export interface PurchaseOrderItemData {
  productId: number;
  quantityOrdered: number;
  unitPrice: number;
  taxRate?: number;
  discountAmount?: number;
  notes?: string;
}

export interface ReceiveOrderData {
  items: ReceiveOrderItemData[];
  receivedDate?: string;
  notes?: string;
}

export interface ReceiveOrderItemData {
  itemId: number;
  quantityReceived: number;
  condition?: 'good' | 'damaged';
  notes?: string;
}

export const PURCHASE_ORDER_STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'pending', label: 'Pending Approval' },
  { value: 'approved', label: 'Approved' },
  { value: 'partially_received', label: 'Partially Received' },
  { value: 'received', label: 'Received' },
  { value: 'cancelled', label: 'Cancelled' },
] as const;

export const PURCHASE_ORDER_STATUS_COLORS: Record<PurchaseOrderStatus, string> = {
  draft: 'bg-gray-100 text-gray-800',
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-blue-100 text-blue-800',
  partially_received: 'bg-purple-100 text-purple-800',
  received: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};
