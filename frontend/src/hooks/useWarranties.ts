import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/services/api';
import type { Warranty, WarrantyClaim, WarrantyClaimInput, WarrantyLookupInput, WarrantyStats } from '@/types/warranty';

const WARRANTIES_QUERY_KEY = 'warranties';

export function useWarranties() {
  const queryClient = useQueryClient();

  // Get all warranties
  const { data: warranties, isLoading } = useQuery<Warranty[]>({
    queryKey: [WARRANTIES_QUERY_KEY],
    queryFn: async () => {
      const response = await apiClient.get('/warranties');
      return response.data;
    },
  });

  // Lookup warranty by serial/receipt
  const lookupMutation = useMutation({
    mutationFn: async (input: WarrantyLookupInput) => {
      const params = new URLSearchParams();
      if (input.serialNumber) params.append('serialNumber', input.serialNumber);
      if (input.receiptNumber) params.append('receiptNumber', input.receiptNumber);
      if (input.productId) params.append('productId', input.productId.toString());
      
      const response = await apiClient.get(`/warranties/lookup?${params.toString()}`);
      return response.data;
    },
  });

  // Get warranty by ID
  const { data: warranty } = useQuery<Warranty, Error>({
    queryKey: [WARRANTIES_QUERY_KEY, 'detail'],
    queryFn: async () => {
      // This query is disabled by default, called with specific ID via refetch
      throw new Error('Use getWarrantyById method instead');
    },
    enabled: false,
  });

  // Create warranty claim
  const createClaimMutation = useMutation({
    mutationFn: async (data: WarrantyClaimInput) => {
      const response = await apiClient.post('/warranties/claim', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [WARRANTIES_QUERY_KEY] });
    },
  });

  // Update warranty claim status
  const updateClaimMutation = useMutation({
    mutationFn: async ({ claimId, status, resolution }: { claimId: number; status: string; resolution?: string }) => {
      const response = await apiClient.put(`/warranties/claims/${claimId}`, { status, resolution });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [WARRANTIES_QUERY_KEY] });
    },
  });

  // Get warranty stats
  const { data: stats } = useQuery<WarrantyStats>({
    queryKey: [WARRANTIES_QUERY_KEY, 'stats'],
    queryFn: async () => {
      const response = await apiClient.get('/warranties/stats');
      return response.data;
    },
  });

  return {
    warranties,
    warranty,
    stats,
    isLoading,
    lookupWarranty: lookupMutation.mutateAsync,
    isLookingUp: lookupMutation.isPending,
    createClaim: createClaimMutation.mutateAsync,
    isCreatingClaim: createClaimMutation.isPending,
    updateClaim: updateClaimMutation.mutateAsync,
    isUpdatingClaim: updateClaimMutation.isPending,
  };
}
