// Inventory Types

export interface InventoryItem {
  id: number;
  productId: number;
  productName: string;
  productSku: string;
  quantityOnHand: number;
  quantityReserved: number;
  quantityAvailable: number;
  reorderPoint: number;
  reorderQuantity: number;
  costPrice: number;
  sellingPrice: number;
  location?: string;
  lastCountedAt?: string;
  updatedAt: string;
}

export interface InventoryMovement {
  id: number;
  productId: number;
  productName: string;
  movementType: 'in' | 'out' | 'adjustment' | 'sale' | 'return' | 'purchase';
  quantity: number;
  quantityBefore: number;
  quantityAfter: number;
  reason?: string;
  referenceType?: string;
  referenceId?: number;
  performedBy: number;
  performedByName: string;
  notes?: string;
  createdAt: string;
}

export interface SerialNumber {
  id: number;
  serialNumber: string;
  productId: number;
  productName: string;
  inventoryItemId: number;
  status: 'available' | 'sold' | 'reserved' | 'repair' | 'warranty';
  purchaseDate?: string;
  saleDate?: string;
  warrantyExpiryDate?: string;
  supplierId?: number;
  supplierName?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryAlert {
  id: number;
  productId: number;
  productName: string;
  productSku: string;
  currentStock: number;
  reorderPoint: number;
  shortage: number;
  severity: 'low' | 'critical' | 'out_of_stock';
  createdAt: string;
}

export interface StockAdjustmentRequest {
  productId: number;
  quantity: number;
  adjustmentType: 'add' | 'remove';
  reason: string;
  notes?: string;
}

export const ADJUSTMENT_REASONS = [
  { value: 'damage', label: 'Damaged goods' },
  { value: 'loss', label: 'Loss/Theft' },
  { value: 'return', label: 'Customer return' },
  { value: 'correction', label: 'Inventory correction' },
  { value: 'found', label: 'Found in stock' },
  { value: 'expired', label: 'Expired product' },
  { value: 'other', label: 'Other' },
] as const;

export type AdjustmentReason = typeof ADJUSTMENT_REASONS[number]['value'];
