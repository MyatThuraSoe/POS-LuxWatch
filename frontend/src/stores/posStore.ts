import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, HeldCart, Customer } from '@/types/pos';

interface POSState {
  // Cart state
  cart: CartItem[];
  heldCarts: HeldCart[];
  
  // Customer selection
  selectedCustomer: Customer | null;
  
  // Pricing
  discount: number;
  discountType: 'percentage' | 'fixed';
  taxRate: number;
  
  // Payment
  paymentMethod: 'cash' | 'card' | 'mixed' | 'wallet';
  
  // UI state
  isCheckoutOpen: boolean;
  isHoldCartOpen: boolean;
  isRecallCartOpen: boolean;
  searchQuery: string;
  selectedCategory: string;
  
  // Actions - Cart management
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  updateCartItem: (productId: number, quantity: number) => void;
  removeCartItem: (productId: number) => void;
  clearCart: () => void;
  
  // Actions - Hold/Recall
  holdCart: (note?: string) => void;
  recallCart: (cartId: string) => void;
  deleteHeldCart: (cartId: string) => void;
  
  // Actions - Customer
  setSelectedCustomer: (customer: Customer | null) => void;
  
  // Actions - Pricing
  setDiscount: (discount: number, type?: 'percentage' | 'fixed') => void;
  setTaxRate: (rate: number) => void;
  
  // Actions - Payment
  setPaymentMethod: (method: 'cash' | 'card' | 'mixed' | 'wallet') => void;
  
  // Actions - UI
  setIsCheckoutOpen: (open: boolean) => void;
  setIsHoldCartOpen: (open: boolean) => void;
  setIsRecallCartOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  
  // Computed values
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  total: number;
}

const generateCartItemId = (): string => {
  return `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const usePOSStore = create<POSState>()(
  persist(
    (set, get) => ({
      // Initial state
      cart: [],
      heldCarts: [],
      selectedCustomer: null,
      discount: 0,
      discountType: 'percentage',
      taxRate: 8.5,
      paymentMethod: 'cash',
      isCheckoutOpen: false,
      isHoldCartOpen: false,
      isRecallCartOpen: false,
      searchQuery: '',
      selectedCategory: 'all',
      
      // Cart actions
      addToCart: (newItem) => {
        const { cart } = get();
        const existingItem = cart.find(item => item.productId === newItem.productId);
        
        if (existingItem) {
          const newQuantity = existingItem.quantity + newItem.quantity;
          if (newQuantity > existingItem.stock) {
            console.warn('Cannot exceed available stock');
            return;
          }
          set({
            cart: cart.map(item =>
              item.productId === newItem.productId
                ? { ...item, quantity: newQuantity }
                : item
            )
          });
        } else {
          set({
            cart: [...cart, { ...newItem, id: generateCartItemId() }]
          });
        }
      },
      
      updateCartItem: (productId, quantity) => {
        const { cart } = get();
        const item = cart.find(i => i.productId === productId);
        
        if (!item) return;
        
        if (quantity <= 0) {
          set({ cart: cart.filter(i => i.productId !== productId) });
        } else if (quantity > item.stock) {
          console.warn('Cannot exceed available stock');
        } else {
          set({
            cart: cart.map(i =>
              i.productId === productId ? { ...i, quantity } : i
            )
          });
        }
      },
      
      removeCartItem: (productId) => {
        set({ cart: get().cart.filter(item => item.productId !== productId) });
      },
      
      clearCart: () => {
        set({
          cart: [],
          selectedCustomer: null,
          discount: 0,
          discountType: 'percentage',
          paymentMethod: 'cash'
        });
      },
      
      // Hold/Recall actions
      holdCart: (note) => {
        const { cart, subtotal, taxAmount, total, selectedCustomer } = get();
        
        if (cart.length === 0) return;
        
        const heldCart: HeldCart = {
          id: generateCartItemId(),
          createdAt: new Date().toISOString(),
          note,
          customerName: selectedCustomer?.name,
          items: [...cart],
          subtotal,
          tax: taxAmount,
          total
        };
        
        set({
          heldCarts: [...get().heldCarts, heldCart],
          cart: []
        });
      },
      
      recallCart: (cartId) => {
        const { heldCarts } = get();
        const heldCart = heldCarts.find(c => c.id === cartId);
        
        if (!heldCart) return;
        
        set({
          cart: heldCart.items,
          heldCarts: heldCarts.filter(c => c.id !== cartId)
        });
      },
      
      deleteHeldCart: (cartId) => {
        set({
          heldCarts: get().heldCarts.filter(c => c.id !== cartId)
        });
      },
      
      // Customer action
      setSelectedCustomer: (customer) => {
        set({ selectedCustomer: customer });
      },
      
      // Pricing actions
      setDiscount: (discount, type) => {
        set({ 
          discount,
          discountType: type ?? get().discountType
        });
      },
      
      setTaxRate: (rate) => {
        set({ taxRate: rate });
      },
      
      // Payment action
      setPaymentMethod: (method) => {
        set({ paymentMethod: method });
      },
      
      // UI actions
      setIsCheckoutOpen: (open) => set({ isCheckoutOpen: open }),
      setIsHoldCartOpen: (open) => set({ isHoldCartOpen: open }),
      setIsRecallCartOpen: (open) => set({ isRecallCartOpen: open }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setSelectedCategory: (category) => set({ selectedCategory: category }),
      
      // Computed values
      get subtotal() {
        return get().cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      },
      
      get discountAmount() {
        const { subtotal, discount, discountType } = get();
        if (discountType === 'percentage') {
          return subtotal * (discount / 100);
        }
        return Math.min(discount, subtotal);
      },
      
      get taxAmount() {
        const { subtotal, discountAmount, taxRate } = get();
        return (subtotal - discountAmount) * (taxRate / 100);
      },
      
      get total() {
        const { subtotal, discountAmount, taxAmount } = get();
        return subtotal - discountAmount + taxAmount;
      }
    }),
    {
      name: 'pos-storage',
      partialize: (state) => ({
        cart: state.cart,
        heldCarts: state.heldCarts,
        taxRate: state.taxRate
      })
    }
  )
);
