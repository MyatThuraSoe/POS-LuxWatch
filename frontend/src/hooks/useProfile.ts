import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../config/api";
import { queryKeys } from "../lib/queryKeys";
import type { ProfileUpdatePayload, PasswordChangePayload, AuthUser } from "../types/user";

export function useProfile() {
  return useQuery({
    queryKey: queryKeys.profile.me,
    queryFn: async () => {
      const response = await apiClient.get<AuthUser>("/api/profile");
      return response.data;
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: ProfileUpdatePayload) => {
      const response = await apiClient.put<AuthUser>("/api/profile", payload);
      return response.data;
    },
    onSuccess: (user) => {
      queryClient.setQueryData(queryKeys.profile.me, user);
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me });
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: async (payload: PasswordChangePayload) => {
      await apiClient.put("/api/profile/password", payload);
    },
  });
}
