import { z } from "zod";
import { APP_NAME, DEFAULT_API_TIMEOUT, THEME_STORAGE_KEY } from "./constants";

const envSchema = z.object({
  VITE_API_BASE_URL: z
    .string()
    .optional()
    .refine(
      (value) => !value || value.startsWith("/") || /^https?:\/\//.test(value),
      {
        message: "VITE_API_BASE_URL must be an absolute URL or a relative path starting with '/'.",
      },
    ),
  VITE_APP_NAME: z.string().min(1).optional(),
  VITE_API_TIMEOUT_MS: z.coerce.number().int().positive().optional(),
  VITE_API_USE_CREDENTIALS: z.coerce.boolean().optional(),
});

export type AppEnv = {
  appName: string;
  apiBaseUrl: string;
  apiTimeoutMs: number;
  apiUseCredentials: boolean;
  themeStorageKey: string;
};

export function getEnv(): AppEnv {
  const parsed = envSchema.safeParse(import.meta.env);

  if (!parsed.success) {
    return {
      appName: APP_NAME,
      apiBaseUrl: "/api/v1",
      apiTimeoutMs: DEFAULT_API_TIMEOUT,
      apiUseCredentials: false,
      themeStorageKey: THEME_STORAGE_KEY,
    };
  }

  return {
    appName: parsed.data.VITE_APP_NAME ?? APP_NAME,
    apiBaseUrl: parsed.data.VITE_API_BASE_URL ?? "/api/v1",
    apiTimeoutMs: parsed.data.VITE_API_TIMEOUT_MS ?? DEFAULT_API_TIMEOUT,
    apiUseCredentials: parsed.data.VITE_API_USE_CREDENTIALS ?? false,
    themeStorageKey: THEME_STORAGE_KEY,
  };
}
