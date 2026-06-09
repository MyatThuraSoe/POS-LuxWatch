import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../config/api";
import { queryKeys } from "../lib/queryKeys";

export function useHealthCheck() {
  return useQuery({
    queryKey: queryKeys.health,
    queryFn: async () => {
      const response = await apiClient.get("/health");
      return response.data as unknown;
    },
    enabled: false,
  });
}
