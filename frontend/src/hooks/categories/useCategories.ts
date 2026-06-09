import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../../lib/queryKeys";
import { api } from "../../config/api";
import type { Category, CreateCategoryPayload, UpdateCategoryPayload, CategoryTreeNode } from "../../types/product";

// Category Tree Query
export const useCategoryTree = () => {
  return useQuery({
    queryKey: queryKeys.categories.tree,
    queryFn: async () => {
      const response = await api.get("/categories/tree");
      return response.data as CategoryTreeNode[];
    },
  });
};

// All Categories List Query
export const useCategories = (params?: { is_active?: boolean }) => {
  return useQuery({
    queryKey: queryKeys.categories.all,
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (params?.is_active !== undefined) queryParams.append("is_active", params.is_active.toString());
      const response = await api.get(`/categories?${queryParams.toString()}`);
      return response.data as Category[];
    },
  });
};

// Single Category Detail Query
export const useCategory = (id: number) => {
  return useQuery({
    queryKey: queryKeys.categories.detail(id),
    queryFn: async () => {
      const response = await api.get(`/categories/${id}`);
      return response.data as Category;
    },
    enabled: !!id,
  });
};

// Create Category Mutation
export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateCategoryPayload) => {
      const response = await api.post("/categories", payload);
      return response.data as Category;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.tree });
    },
  });
};

// Update Category Mutation
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateCategoryPayload }) => {
      const response = await api.put(`/categories/${id}`, data);
      return response.data as Category;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.tree });
    },
  });
};

// Delete Category Mutation
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/categories/${id}`);
      return id;
    },
    onSuccess: (deletedId) => {
      queryClient.removeQueries({ queryKey: queryKeys.categories.detail(deletedId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.tree });
    },
  });
};
