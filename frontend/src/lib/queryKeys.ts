export const queryKeys = {
  health: ["health"] as const,
  auth: {
    me: ["auth", "me"] as const,
    session: ["auth", "session"] as const,
  },
  products: {
    all: ["products"] as const,
    list: (params?: Record<string, unknown>) => ["products", "list", params ?? {}] as const,
    detail: (id: string | number) => ["products", "detail", id] as const,
    variants: (productId: string | number) => ["products", productId, "variants"] as const,
    images: (productId: string | number) => ["products", productId, "images"] as const,
    search: (query: string) => ["products", "search", query] as const,
  },
  categories: {
    all: ["categories"] as const,
    tree: ["categories", "tree"] as const,
    detail: (id: number) => ["categories", "detail", id] as const,
  },
  brands: {
    all: ["brands"] as const,
    list: (params?: Record<string, unknown>) => ["brands", "list", params ?? {}] as const,
    detail: (id: number) => ["brands", "detail", id] as const,
  },
  dashboard: {
    kpis: ["dashboard", "kpis"] as const,
    salesDaily: ["dashboard", "sales", "daily"] as const,
    todaySummary: ["dashboard", "today", "summary"] as const,
    alerts: ["dashboard", "alerts"] as const,
    activity: ["dashboard", "activity"] as const,
  },
  inventory: {
    all: ["inventory"] as const,
    list: (filters?: Record<string, unknown>) => ["inventory", "list", filters ?? {}] as const,
    detail: (id: number) => ["inventory", "detail", id] as const,
    movements: (filters?: Record<string, unknown>) => ["inventory", "movements", filters ?? {}] as const,
    serials: (filters?: Record<string, unknown>) => ["inventory", "serials", filters ?? {}] as const,
    alerts: () => ["inventory", "alerts"] as const,
  },
  users: {
    all: ["users"] as const,
    list: (params?: Record<string, unknown>) => ["users", "list", params ?? {}] as const,
    detail: (id: number) => ["users", "detail", id] as const,
    permissions: (id: number) => ["users", "permissions", id] as const,
  },
  roles: {
    all: ["roles"] as const,
  },
  permissions: {
    all: ["permissions"] as const,
  },
  profile: {
    me: ["profile", "me"] as const,
  },
};
