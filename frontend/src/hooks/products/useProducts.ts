import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../../lib/queryKeys";
import { api } from "../../config/api";
import type {
  Product,
  ProductListParams,
  CreateProductPayload,
  UpdateProductPayload,
  ProductVariant,
  CreateVariantPayload,
  UpdateVariantPayload,
  ImageUploadPayload,
  ProductImage,
} from "../../types/product";

// Product List Query
export const useProducts = (params?: ProductListParams) => {
  return useQuery({
    queryKey: queryKeys.products.list(params),
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append("page", params.page.toString());
      if (params?.per_page) queryParams.append("per_page", params.per_page.toString());
      if (params?.sort_by) queryParams.append("sort_by", params.sort_by);
      if (params?.sort_order) queryParams.append("sort_order", params.sort_order);
      if (params?.search) queryParams.append("search", params.search);
      if (params?.brand_id !== null && params?.brand_id !== undefined) queryParams.append("brand_id", params.brand_id.toString());
      if (params?.category_id !== null && params?.category_id !== undefined) queryParams.append("category_id", params.category_id.toString());
      if (params?.type) queryParams.append("type", params.type);
      if (params?.status) queryParams.append("status", params.status);
      if (params?.min_price !== null && params?.min_price !== undefined) queryParams.append("min_price", params.min_price.toString());
      if (params?.max_price !== null && params?.max_price !== undefined) queryParams.append("max_price", params.max_price.toString());
      if (params?.in_stock !== null && params?.in_stock !== undefined) queryParams.append("in_stock", params.in_stock.toString());
      if (params?.low_stock !== null && params?.low_stock !== undefined) queryParams.append("low_stock", params.low_stock.toString());

      const response = await api.get(`/products?${queryParams.toString()}`);
      return response.data;
    },
  });
};

// Single Product Detail Query
export const useProduct = (id: number | string) => {
  return useQuery({
    queryKey: queryKeys.products.detail(id),
    queryFn: async () => {
      const response = await api.get(`/products/${id}`);
      return response.data as Product;
    },
    enabled: !!id,
  });
};

// Create Product Mutation
export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateProductPayload) => {
      const response = await api.post("/products", payload);
      return response.data as Product;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
    },
  });
};

// Update Product Mutation
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number | string; data: UpdateProductPayload }) => {
      const response = await api.put(`/products/${id}`, data);
      return response.data as Product;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
    },
  });
};

// Delete Product Mutation
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/products/${id}`);
      return id;
    },
    onSuccess: (deletedId) => {
      queryClient.removeQueries({ queryKey: queryKeys.products.detail(deletedId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
    },
  });
};

// Product Variants Queries and Mutations
export const useProductVariants = (productId: number | string) => {
  return useQuery({
    queryKey: queryKeys.products.variants(productId),
    queryFn: async () => {
      const response = await api.get(`/products/${productId}/variants`);
      return response.data as ProductVariant[];
    },
    enabled: !!productId,
  });
};

export const useCreateVariant = (productId: number | string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateVariantPayload) => {
      const response = await api.post(`/products/${productId}/variants`, payload);
      return response.data as ProductVariant;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.variants(productId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.products.detail(productId) });
    },
  });
};

export const useUpdateVariant = (productId: number | string, variantId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: UpdateVariantPayload) => {
      const response = await api.put(`/products/variants/${variantId}`, payload);
      return response.data as ProductVariant;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.variants(productId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.products.detail(productId) });
    },
  });
};

export const useDeleteVariant = (productId: number | string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (variantId: number) => {
      await api.delete(`/products/variants/${variantId}`);
      return variantId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.variants(productId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.products.detail(productId) });
    },
  });
};

// Product Images Mutations
export const useUploadProductImage = (productId: number | string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: ImageUploadPayload) => {
      const formData = new FormData();
      formData.append("file", payload.file);
      if (payload.alt_text) formData.append("alt_text", payload.alt_text);
      if (payload.position !== undefined) formData.append("position", payload.position.toString());

      const response = await api.post(`/products/${productId}/images`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data as ProductImage;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.images(productId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.products.detail(productId) });
    },
  });
};

export const useDeleteProductImage = (productId: number | string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (imageId: number) => {
      await api.delete(`/products/images/${imageId}`);
      return imageId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.images(productId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.products.detail(productId) });
    },
  });
};

// Product Search Hook
export const useProductSearch = (query: string) => {
  return useQuery({
    queryKey: queryKeys.products.search(query),
    queryFn: async () => {
      const response = await api.get(`/products/search?q=${encodeURIComponent(query)}`);
      return response.data as Product[];
    },
    enabled: query.length >= 2,
  });
};
