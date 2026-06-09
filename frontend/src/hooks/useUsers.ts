import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../config/api";
import { queryKeys } from "../lib/queryKeys";
import type {
  User,
  CreateUserPayload,
  UpdateUserPayload,
  Permission,
  Role,
  UserPermissions,
} from "../types/user";

interface UsersListResponse {
  data: User[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

interface UsersListParams {
  page?: number;
  per_page?: number;
  search?: string;
  role?: string;
  status?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

export function useUsers(params?: UsersListParams) {
  return useQuery({
    queryKey: queryKeys.users.list(params as Record<string, unknown> | undefined),
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; data: UsersListResponse; message?: string }>("/users", { params });
      // API likely returns { success, data, message }
      // where `data` is the paginated payload.
      return response.data.data;
    },
  });
}

export function useUser(id: number) {
  return useQuery({
    queryKey: queryKeys.users.detail(id),
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; data: User; message?: string }>(`/users/${id}`);
      return response.data.data as User;
    },
    enabled: id > 0,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateUserPayload) => {
      const response = await apiClient.post<User>("/users", payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });
}

export function useUpdateUser(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: UpdateUserPayload) => {
      const response = await apiClient.put<User>(`/users/${id}`, payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(`/api/users/${id}`);
      return id;
    },
    onSuccess: (id) => {
      queryClient.removeQueries({ queryKey: queryKeys.users.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });
}

export function useToggleUserStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: "active" | "inactive" | "suspended" }) => {
      const response = await apiClient.patch<User>(`/api/users/${id}/status`, { status });
      return response.data;
    },
    onSuccess: (user) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(user.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });
}

export function useRoles() {
  return useQuery({
    queryKey: queryKeys.roles.all,
    queryFn: async () => {
      const response = await apiClient.get<Role[]>("/api/roles");
      return response.data;
    },
  });
}

export function usePermissions() {
  return useQuery({
    queryKey: queryKeys.permissions.all,
    queryFn: async () => {
      const response = await apiClient.get<Permission[]>("/api/permissions");
      return response.data;
    },
  });
}

export function useUserPermissions(userId: number) {
  return useQuery({
    queryKey: queryKeys.users.permissions(userId),
    queryFn: async () => {
      const response = await apiClient.get<UserPermissions>(`/api/users/${userId}/permissions`);
      return response.data;
    },
    enabled: userId > 0,
  });
}

export function useUpdatePermissions(userId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (permissions: string[]) => {
      const response = await apiClient.put<UserPermissions>(`/api/users/${userId}/permissions`, {
        permissions,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.permissions(userId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(userId) });
    },
  });
}
