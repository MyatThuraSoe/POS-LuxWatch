import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../config/api';
import type {
  PurchaseOrder,
  PurchaseOrderFormData,
  PurchaseOrderItemData,
  ReceiveOrderData,
} from '../types/purchaseOrder';
import type { Supplier } from '../types/supplier';

const queryKeys = {
  all: ['purchaseOrders'] as const,
  lists: () => [...queryKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...queryKeys.lists(), filters] as const,
  details: () => [...queryKeys.all, 'detail'] as const,
  detail: (id: number) => [...queryKeys.details(), id] as const,
  items: (id: number) => [...queryKeys.detail(id), 'items'] as const,
};

export function usePurchaseOrders(filters?: Record<string, unknown>) {
  return useQuery({
    queryKey: queryKeys.list(filters ?? {}),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, String(value));
          }
        });
      }
      const response = await apiClient.get(`/api/purchase-orders?${params.toString()}`);
      return response.data;
    },
  });
}

export function usePurchaseOrder(id: number) {
  return useQuery({
    queryKey: queryKeys.detail(id),
    queryFn: async () => {
      const response = await apiClient.get(`/api/purchase-orders/${id}`);
      return response.data.data as PurchaseOrder;
    },
    enabled: !!id,
  });
}

export function useSuppliers(filters?: Record<string, unknown>) {
  return useQuery({
    queryKey: ['suppliers', filters ?? {}] as const,
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, String(value));
          }
        });
      }
      const response = await apiClient.get(`/api/suppliers?${params.toString()}`);
      return response.data as { data: Supplier[] };
    },
  });
}

export function useCreatePO() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: PurchaseOrderFormData) => {
      const response = await apiClient.post('/api/purchase-orders', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.all });
    },
  });
}

export function useUpdatePO() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<PurchaseOrderFormData> }) => {
      const response = await apiClient.put(`/api/purchase-orders/${id}`, data);
      return response.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.all });
    },
  });
}

export function useCancelPO() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await apiClient.delete(`/api/purchase-orders/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.all });
    },
  });
}

export function useApprovePO() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await apiClient.post(`/api/purchase-orders/${id}/approve`);
      return response.data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.all });
    },
  });
}

export function useReceivePO() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: ReceiveOrderData }) => {
      const response = await apiClient.post(`/api/purchase-orders/${id}/receive`, data);
      return response.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.all });
    },
  });
}

export function usePOItems(id: number) {
  return useQuery({
    queryKey: queryKeys.items(id),
    queryFn: async () => {
      const response = await apiClient.get(`/api/purchase-orders/${id}/items`);
      return response.data.data;
    },
    enabled: !!id,
  });
}

export function useAddPOItem(orderId: number) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: PurchaseOrderItemData) => {
      const response = await apiClient.post(`/api/purchase-orders/${orderId}/items`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.items(orderId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.detail(orderId) });
    },
  });
}

export function useUpdatePOItem(orderId: number) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ itemId, data }: { itemId: number; data: Partial<PurchaseOrderItemData> }) => {
      const response = await apiClient.put(`/api/purchase-orders/items/${itemId}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.items(orderId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.detail(orderId) });
    },
  });
}

export function useDeletePOItem(orderId: number) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (itemId: number) => {
      const response = await apiClient.delete(`/api/purchase-orders/items/${itemId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.items(orderId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.detail(orderId) });
    },
  });
}
