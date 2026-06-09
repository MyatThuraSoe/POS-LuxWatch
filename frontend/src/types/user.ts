import type { UserRoleName } from "../stores/authStore";

export type UserStatus = "active" | "inactive" | "suspended";

// AuthUser is the authenticated user object returned from login
export type AuthUser = User & {
  token?: string;
};

export type User = {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  avatarUrl?: string | null;
  status: UserStatus;
  role: UserRoleName;
  roles: UserRoleName[];
  permissions: string[];
  createdAt?: string;
  updatedAt?: string;
};

export type CreateUserPayload = {
  name: string;
  email: string;
  password: string;
  role: UserRoleName;
  phone?: string | null;
};

export type UpdateUserPayload = Partial<CreateUserPayload> & {
  status?: UserStatus;
};

export type DashboardKPIs = {
  total_revenue: number;
  gross_profit: number;
  profit_margin: number;
  transaction_count: number;
  avg_order_value: number;
  low_stock_count: number;
  period: {
    start: string;
    end: string;
  };
};

export type DailySalesData = {
  date: string;
  revenue: number;
  transactions: number;
};

export type InventoryAlert = {
  id: number;
  variant_id: number;
  product_name: string;
  variant_name?: string;
  current_quantity: number;
  low_stock_threshold: number;
  brand_name?: string;
};

export type TodaySummary = {
  sales_count: number;
  total_revenue: number;
  total_items_sold: number;
};

export type ActivityItem = {
  id: number;
  type: string;
  description: string;
  user_name: string;
  created_at: string;
};

export type Permission = {
  id: number;
  name: string;
  group: string;
  description?: string;
};

export type Role = {
  id: number;
  name: UserRoleName;
  display_name: string;
  permissions: Permission[];
};

export type UserPermissions = {
  user_id: number;
  permissions: string[];
};

export type ProfileUpdatePayload = {
  name: string;
  email: string;
  phone?: string | null;
};

export type PasswordChangePayload = {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
};
