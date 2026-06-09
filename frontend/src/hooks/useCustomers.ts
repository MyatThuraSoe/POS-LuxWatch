import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/services/api';
import type { Customer, CustomerCreateInput, CustomerUpdateInput, CustomerStats, CustomerPurchase } from '@/types/customer';

const CUSTOMERS_QUERY_KEY = 'customers';

export function useCustomers() {
  const queryClient = useQueryClient();

  // Get all customers
  const { data: customers, isLoading } = useQuery<Customer[]>({
    queryKey: [CUSTOMERS_QUERY_KEY],
    queryFn: async () => {
      const response = await apiClient.get('/customers');
      return response.data;
    },
  });

  // Get customer by ID
  const { data: customer, isLoading: isLoadingCustomer } = useQuery<Customer, Error>({
    queryKey: [CUSTOMERS_QUERY_KEY, 'detail'],
    queryFn: async () => {
      // This query is disabled by default, called with specific ID via refetch
      throw new Error('Use getCustomerById method instead');
    },
    enabled: false,
  });

  // Create customer
  const createMutation = useMutation({
    mutationFn: async (data: CustomerCreateInput) => {
      const response = await apiClient.post('/customers', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CUSTOMERS_QUERY_KEY] });
    },
  });

  // Update customer
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: CustomerUpdateInput }) => {
      const response = await apiClient.put(`/customers/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CUSTOMERS_QUERY_KEY] });
    },
  });

  // Delete customer
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(`/customers/${id}`);
      return id;
    },
    onSuccess: (deletedId) => {
      queryClient.invalidateQueries({ queryKey: [CUSTOMERS_QUERY_KEY] });
      // Remove from cache
      const existing = queryClient.getQueryData<Customer[]>([CUSTOMERS_QUERY_KEY]);
      if (existing) {
        queryClient.setQueryData(
          [CUSTOMERS_QUERY_KEY],
          existing.filter((c) => c.id !== deletedId)
        );
      }
    },
  });

  // Get customer purchases
  const { data: purchases } = useQuery<CustomerPurchase[]>({
    queryKey: [CUSTOMERS_QUERY_KEY, 'purchases'],
    queryFn: async ({ queryKey }) => {
      const [, id] = queryKey;
      if (!id) throw new Error('Customer ID required');
      const response = await apiClient.get(`/customers/${id}/purchases`);
      return response.data;
    },
    enabled: false,
  });

  // Get customer stats
  const { data: stats } = useQuery<CustomerStats>({
    queryKey: [CUSTOMERS_QUERY_KEY, 'stats'],
    queryFn: async () => {
      const response = await apiClient.get('/customers/stats');
      return response.data;
    },
  });

  return {
    customers,
    customer,
    purchases,
    stats,
    isLoading,
    isLoadingCustomer,
    createCustomer: createMutation.mutateAsync,
    updateCustomer: updateMutation.mutateAsync,
    deleteCustomer: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
