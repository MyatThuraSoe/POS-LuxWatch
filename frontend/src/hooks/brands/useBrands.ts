import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../../lib/queryKeys";
import { api } from "../../config/api";
import type { Brand, CreateBrandPayload, UpdateBrandPayload } from "../../types/product";

// Brands List Query
export const useBrands = (params?: { is_active?: boolean; search?: string }) => {
  return useQuery({
    queryKey: queryKeys.brands.list(params),
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (params?.is_active !== undefined) queryParams.append("is_active", params.is_active.toString());
      if (params?.search) queryParams.append("search", params.search);
      const response = await api.get(`/brands?${queryParams.toString()}`);
      return response.data as Brand[];
    },
  });
};

// Single Brand Detail Query
export const useBrand = (id: number) => {
  return useQuery({
    queryKey: queryKeys.brands.detail(id),
    queryFn: async () => {
      const response = await api.get(`/brands/${id}`);
      return response.data as Brand;
    },
    enabled: !!id,
  });
};

// Create Brand Mutation
export const useCreateBrand = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateBrandPayload) => {
      const response = await api.post("/brands", payload);
      return response.data as Brand;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.brands.all });
    },
  });
};

// Update Brand Mutation
export const useUpdateBrand = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: UpdateBrandPayload & { id: number }) => {
      const { id, ...updateData } = data;
      const response = await api.put(`/brands/${id}`, updateData);
      return response.data as Brand;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.brands.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.brands.all });
    },
  });
};

// Delete Brand Mutation
export const useDeleteBrand = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/brands/${id}`);
      return id;
    },
    onSuccess: (deletedId) => {
      queryClient.removeQueries({ queryKey: queryKeys.brands.detail(deletedId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.brands.all });
    },
  });
};
