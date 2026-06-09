import { AUTH_ENDPOINTS } from "../config/constants";
import { apiClient } from "../config/api";
import type { ApiResponse } from "../types";
import type { AuthUser, UserRoleName } from "../stores/authStore";

export type LoginPayload = {
  email: string;
  password: string;
  remember?: boolean;
};

type BackendRole = UserRoleName | { id?: number | string; name: UserRoleName };

type BackendUser = {
  id: number | string;
  name: string;
  email: string;
  phone?: string | null;
  avatar_url?: string | null;
  status?: string;
  role?: UserRoleName;
  roles?: BackendRole[];
  permissions?: string[];
};

type LoginResponse = {
  user?: BackendUser;
  token?: string;
  access_token?: string;
  refresh_token?: string;
};

function normalizeRoles(user: BackendUser) {
  const roles = user.roles?.map((role) => (typeof role === "string" ? role : role.name)) ?? [];
  return roles.length > 0 ? roles : user.role ? [user.role] : ["employee"];
}

export function normalizeUser(user: BackendUser): AuthUser {
  const roles = normalizeRoles(user);

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    avatarUrl: user.avatar_url,
    status: user.status,
    role: user.role ?? roles[0],
    roles,
    permissions: user.permissions ?? [],
  };
}

export async function login(payload: LoginPayload) {
  const response = await apiClient.post<ApiResponse<LoginResponse> | LoginResponse>(
    AUTH_ENDPOINTS.login,
    payload,
  );
  const body = "data" in response.data ? response.data.data : response.data;
  const user = body.user ? normalizeUser(body.user) : null;

  return {
    user,
    token: body.token ?? body.access_token ?? "",
    refreshToken: body.refresh_token ?? null,
  };
}

export async function logout() {
  await apiClient.post(AUTH_ENDPOINTS.logout);
}

export async function getCurrentUser() {
  const response = await apiClient.get<ApiResponse<BackendUser> | BackendUser>(AUTH_ENDPOINTS.me);
  const body = "data" in response.data ? response.data.data : response.data;

  return normalizeUser(body);
}
