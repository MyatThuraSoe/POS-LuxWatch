import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/services/api';
import type { CartItem, CheckoutData } from '@/types/pos';

const POS_QUERY_KEY = 'pos';

export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  sku: string;
  category?: string;
  image_url?: string;
}

export function usePOS() {
  const queryClient = useQueryClient();

  // Get all products for POS
  const { data: products, isLoading: isLoadingProducts } = useQuery<Product[]>({
    queryKey: [POS_QUERY_KEY, 'products'],
    queryFn: async () => {
      const response = await apiClient.get('/products');
      return response.data;
    },
  });

  // Get today's sales summary
  const { data: todaySummary, isLoading: isLoadingTodaySummary } = useQuery({
    queryKey: [POS_QUERY_KEY, 'today-summary'],
    queryFn: async () => {
      const response = await apiClient.get('/pos/sales/today');
      return response.data;
    },
  });

  // Get sale details for receipt
  const { data: saleDetails } = useQuery({
    queryKey: [POS_QUERY_KEY, 'sale-details'],
    queryFn: async ({ queryKey }) => {
      const [, saleId] = queryKey;
      if (!saleId) throw new Error('Sale ID required');
      const response = await apiClient.get(`/pos/sales/${saleId}`);
      return response.data.sale;
    },
    enabled: false,
  });

  // Add to cart mutation (local only - backend cart not used in this implementation)
  const addToCartMutation = useMutation({
    mutationFn: async (item: { variant_id: number; quantity: number }) => {
      // For now, we handle cart locally in the store
      // This is a placeholder for future server-side cart integration
      return item;
    },
  });

  // Checkout mutation
  const checkoutMutation = useMutation({
    mutationFn: async (data: { 
      items: Array<{ variant_id: number; quantity: number; price: number }>;
      customer_id?: number;
      discount: number;
      discount_type: 'percentage' | 'fixed';
      payment_method: 'cash' | 'card' | 'mixed' | 'wallet';
      cash_received?: number;
      notes?: string;
    }) => {
      const response = await apiClient.post('/pos/checkout', data, {
        headers: {
          'X-Idempotency-Key': `checkout_${Date.now()}`,
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [POS_QUERY_KEY, 'cart'] });
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      queryClient.invalidateQueries({ queryKey: [POS_QUERY_KEY, 'today-summary'] });
    },
  });

  return {
    products,
    todaySummary,
    saleDetails,
    isLoadingProducts,
    isLoadingTodaySummary,
    addToCart: addToCartMutation.mutateAsync,
    checkout: checkoutMutation.mutateAsync,
    isCheckingOut: checkoutMutation.isPending,
    refetchTodaySummary: () => queryClient.invalidateQueries({ queryKey: [POS_QUERY_KEY, 'today-summary'] }),
  };
}
