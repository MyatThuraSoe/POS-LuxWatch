import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/services/api';
import type { Sale, RefundData, SalesFilters, TodaySummary } from '@/types/sale';

const SALES_QUERY_KEY = 'sales';

export function useSales() {
  const queryClient = useQueryClient();

  // Get all sales with filters
  const { data: sales, isLoading } = useQuery<Sale[]>({
    queryKey: [SALES_QUERY_KEY],
    queryFn: async ({ queryKey }) => {
      const [, filters] = queryKey as [string, SalesFilters?];
      const params = new URLSearchParams();
      if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters?.dateTo) params.append('dateTo', filters.dateTo);
      if (filters?.customerId) params.append('customerId', filters.customerId.toString());
      if (filters?.paymentMethod) params.append('paymentMethod', filters.paymentMethod);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.searchQuery) params.append('search', filters.searchQuery);
      
      const response = await apiClient.get(`/pos/sales?${params.toString()}`);
      return response.data;
    },
  });

  // Get sale by ID
  const { data: sale } = useQuery<Sale, Error>({
    queryKey: [SALES_QUERY_KEY, 'detail'],
    queryFn: async () => {
      // This query is disabled by default, called with specific ID via refetch
      throw new Error('Use getSaleById method instead');
    },
    enabled: false,
  });

  // Process refund
  const refundMutation = useMutation({
    mutationFn: async (data: RefundData) => {
      const response = await apiClient.post(`/pos/sales/${data.saleId}/refund`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SALES_QUERY_KEY] });
    },
  });

  // Get today's summary
  const { data: todaySummary } = useQuery<TodaySummary>({
    queryKey: [SALES_QUERY_KEY, 'today'],
    queryFn: async () => {
      const response = await apiClient.get('/pos/sales/today');
      return response.data;
    },
  });

  // Get sale receipt (for printing)
  const { data: receipt } = useQuery({
    queryKey: [SALES_QUERY_KEY, 'receipt'],
    queryFn: async ({ queryKey }) => {
      const [, id] = queryKey;
      if (!id) throw new Error('Sale ID required');
      const response = await apiClient.get(`/receipts/${id}`, { responseType: 'blob' });
      return response.data;
    },
    enabled: false,
  });

  return {
    sales,
    sale,
    receipt,
    todaySummary,
    isLoading,
    processRefund: refundMutation.mutateAsync,
    isProcessingRefund: refundMutation.isPending,
    refetchSales: () => queryClient.invalidateQueries({ queryKey: [SALES_QUERY_KEY] }),
  };
}
