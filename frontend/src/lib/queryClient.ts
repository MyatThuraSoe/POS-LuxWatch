import { QueryClient } from "@tanstack/react-query";
import { DEFAULT_QUERY_GC_TIME, DEFAULT_QUERY_STALE_TIME } from "../config/constants";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: DEFAULT_QUERY_STALE_TIME,
      gcTime: DEFAULT_QUERY_GC_TIME,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});
