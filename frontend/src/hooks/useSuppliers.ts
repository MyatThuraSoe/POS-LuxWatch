import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../config/api';
import type { Supplier, SupplierContact, SupplierFormData } from '../types/supplier';

const queryKeys = {
  all: ['suppliers'] as const,
  lists: () => [...queryKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...queryKeys.lists(), filters] as const,
  details: () => [...queryKeys.all, 'detail'] as const,
  detail: (id: number) => [...queryKeys.details(), id] as const,
  contacts: (id: number) => [...queryKeys.detail(id), 'contacts'] as const,
  purchases: (id: number) => [...queryKeys.detail(id), 'purchases'] as const,
};

export function useSuppliers(filters?: Record<string, unknown>) {
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
      const response = await apiClient.get(`/api/suppliers?${params.toString()}`);
      return response.data;
    },
  });
}

export function useSupplier(id: number) {
  return useQuery({
    queryKey: queryKeys.detail(id),
    queryFn: async () => {
      const response = await apiClient.get(`/api/suppliers/${id}`);
      return response.data.data as Supplier;
    },
    enabled: !!id,
  });
}

export function useCreateSupplier() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: SupplierFormData) => {
      const response = await apiClient.post('/api/suppliers', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.all });
    },
  });
}

export function useUpdateSupplier() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<SupplierFormData> }) => {
      const response = await apiClient.put(`/api/suppliers/${id}`, data);
      return response.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.all });
    },
  });
}

export function useDeleteSupplier() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await apiClient.delete(`/api/suppliers/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.all });
    },
  });
}

export function useSupplierContacts(supplierId: number) {
  return useQuery({
    queryKey: queryKeys.contacts(supplierId),
    queryFn: async () => {
      const response = await apiClient.get(`/api/suppliers/${supplierId}/contacts`);
      return response.data.data as SupplierContact[];
    },
    enabled: !!supplierId,
  });
}

export function useAddContact(supplierId: number) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Partial<SupplierContact>) => {
      const response = await apiClient.post(`/api/suppliers/${supplierId}/contacts`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contacts(supplierId) });
    },
  });
}

export function useUpdateContact(supplierId: number) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ contactId, data }: { contactId: number; data: Partial<SupplierContact> }) => {
      const response = await apiClient.put(`/api/suppliers/contacts/${contactId}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contacts(supplierId) });
    },
  });
}

export function useDeleteContact(supplierId: number) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (contactId: number) => {
      const response = await apiClient.delete(`/api/suppliers/contacts/${contactId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contacts(supplierId) });
    },
  });
}

export function useSupplierPurchases(supplierId: number) {
  return useQuery({
    queryKey: queryKeys.purchases(supplierId),
    queryFn: async () => {
      const response = await apiClient.get(`/api/suppliers/${supplierId}/purchases`);
      return response.data.data;
    },
    enabled: !!supplierId,
  });
}
