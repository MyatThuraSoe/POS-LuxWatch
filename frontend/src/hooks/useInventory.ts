import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../config/api';
import { queryKeys } from '../lib/queryKeys';
import type {
  InventoryItem,
  InventoryMovement,
  SerialNumber,
  InventoryAlert,
  StockAdjustmentRequest,
} from '../types/inventory';

export function useInventory(filters?: Record<string, unknown>) {
  return useQuery({
    queryKey: queryKeys.inventory.list(filters ?? {}),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, String(value));
          }
        });
      }
      const response = await apiClient.get(`/api/inventory?${params.toString()}`);
      return response.data;
    },
  });
}

export function useProductStock(productId: number) {
  return useQuery({
    queryKey: queryKeys.inventory.detail(productId),
    queryFn: async () => {
      const response = await apiClient.get(`/api/inventory/${productId}`);
      return response.data.data as InventoryItem;
    },
    enabled: !!productId,
  });
}

export function useStockAdjustment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: StockAdjustmentRequest) => {
      const response = await apiClient.post('/api/inventory/adjust', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.inventory.all });
    },
  });
}

export function useMovementHistory(filters?: Record<string, unknown>) {
  return useQuery({
    queryKey: queryKeys.inventory.movements(filters ?? {}),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, String(value));
          }
        });
      }
      const response = await apiClient.get(`/api/inventory/movements?${params.toString()}`);
      return response.data.data as InventoryMovement[];
    },
  });
}

export function useSerialNumbers(filters?: Record<string, unknown>) {
  return useQuery({
    queryKey: queryKeys.inventory.serials(filters ?? {}),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, String(value));
          }
        });
      }
      const response = await apiClient.get(`/api/inventory/serials?${params.toString()}`);
      return response.data.data as SerialNumber[];
    },
  });
}

export function useSerialLookup(serial: string) {
  return useQuery({
    queryKey: [...queryKeys.inventory.serials(), serial],
    queryFn: async () => {
      const response = await apiClient.get(`/api/inventory/serials/${serial}`);
      return response.data.data as SerialNumber;
    },
    enabled: !!serial,
  });
}

export function useInventoryAlerts() {
  return useQuery({
    queryKey: queryKeys.inventory.alerts(),
    queryFn: async () => {
      const response = await apiClient.get('/api/inventory/alerts');
      return response.data.data as InventoryAlert[];
    },
  });
}
