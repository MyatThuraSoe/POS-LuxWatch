// POS & Cart Types
import type { Customer } from './customer';

export interface CartItem {
  id: string;
  productId: number;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  stock: number;
  category?: string;
  imageUrl?: string;
  discount?: number;
}

export interface HeldCart {
  id: string;
  createdAt: string;
  note?: string;
  customerName?: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
}

export interface CheckoutData {
  customerId?: number;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  discount: number;
  discountType: 'percentage' | 'fixed';
  paymentMethod: 'cash' | 'card' | 'mixed' | 'wallet';
  cashReceived?: number;
  cardNumber?: string;
  notes?: string;
}

export interface SaleCompleteData {
  saleId: number;
  receiptNumber: string;
  total: number;
  change?: number;
  timestamp: string;
}

export interface POSState {
  cart: CartItem[];
  heldCarts: HeldCart[];
  selectedCustomer: Customer | null;
  discount: number;
  discountType: 'percentage' | 'fixed';
  taxRate: number;
  paymentMethod: 'cash' | 'card' | 'mixed' | 'wallet';
  isCheckoutOpen: boolean;
  isHoldCartOpen: boolean;
  isRecallCartOpen: boolean;
  searchQuery: string;
  selectedCategory: string;
}

// Re-export Customer for convenience
export type { Customer };
