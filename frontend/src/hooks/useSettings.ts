import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import type { AllSettings, SettingsCategory } from '@/types/settings';

export function useSettings() {
  return useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const response = await api.get<AllSettings>('/settings');
      return response.data;
    },
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: Partial<AllSettings>) => {
      const response = await api.put<AllSettings>('/settings', settings);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
  });
}

export function useSettingsCategory(category: SettingsCategory) {
  return useQuery({
    queryKey: ['settings', category],
    queryFn: async () => {
      const response = await api.get(`/settings/${category}`);
      return response.data;
    },
    enabled: !!category,
  });
}

export function useUpdateSettingsCategory(category: SettingsCategory) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: unknown) => {
      const response = await api.put(`/settings/${category}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      queryClient.invalidateQueries({ queryKey: ['settings', category] });
    },
  });
}
