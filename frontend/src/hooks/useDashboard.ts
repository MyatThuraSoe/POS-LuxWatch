import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../config/api";
import { queryKeys } from "../lib/queryKeys";
import type { DashboardKPIs, DailySalesData, TodaySummary, InventoryAlert, ActivityItem } from "../types/user";

export function useDashboardData() {
  return useQuery({
    queryKey: queryKeys.dashboard.kpis,
    queryFn: async () => {
      const response = await apiClient.get<{ data: DashboardKPIs }>("/reports/dashboard");
      return response.data.data;
    },
  });
}

export function useDailySales() {
  return useQuery({
    queryKey: queryKeys.dashboard.salesDaily,
    queryFn: async () => {
      const response = await apiClient.get<{ data: DailySalesData[] }>("/reports/sales");
      return response.data.data ?? [];
    },
  });
}

export function useTodaySummary() {
  return useQuery({
    queryKey: queryKeys.dashboard.todaySummary,
    queryFn: async () => {
      const response = await apiClient.get<{ data: TodaySummary }>("/pos/sales/today");
      return response.data.data;
    },
  });
}

export function useInventoryAlerts() {
  return useQuery({
    queryKey: queryKeys.dashboard.alerts,
    queryFn: async () => {
      const response = await apiClient.get<{ data: InventoryAlert[] }>("/inventory/low-stock");
      return response.data.data ?? [];
    },
  });
}

export function useActivityFeed() {
  return useQuery({
    queryKey: queryKeys.dashboard.activity,
    queryFn: async () => {
      const response = await apiClient.get<{ data: ActivityItem[] }>("/reports/activity");
      return response.data.data ?? [];
    },
  });
}