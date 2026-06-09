import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { getCurrentUser, login, logout, type LoginPayload } from "../services/authService";
import { queryKeys } from "../lib/queryKeys";
import { useAuthStore } from "../stores/authStore";

export function useCurrentUser() {
  const token = useAuthStore((state) => state.token);
  const setUser = useAuthStore((state) => state.setUser);

  return useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: async () => {
      const user = await getCurrentUser();
      setUser(user);
      return user;
    },
    enabled: Boolean(token),
  });
}

export function useLoginMutation() {
  const navigate = useNavigate();
  const setSession = useAuthStore((state) => state.setSession);
  const intendedPath = useAuthStore((state) => state.intendedPath);
  const setIntendedPath = useAuthStore((state) => state.setIntendedPath);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: LoginPayload) => login(payload),
    onSuccess: async (session) => {
      if (!session.user || !session.token) {
        throw new Error("Login response did not include a user session.");
      }

      setSession(session.user, session.token, session.refreshToken);
      await queryClient.invalidateQueries({ queryKey: queryKeys.auth.me });
      toast.success("Signed in", { description: `Welcome back, ${session.user.name}.` });
      navigate(intendedPath ?? "/dashboard", { replace: true });
      setIntendedPath(null);
    },
  });
}

export function useLogoutMutation() {
  const navigate = useNavigate();
  const clearSession = useAuthStore((state) => state.clearSession);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSettled: async () => {
      clearSession();
      await queryClient.clear();
      navigate("/login", { replace: true });
    },
  });
}
