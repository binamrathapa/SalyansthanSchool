import axios, { 
  AxiosError, 
  InternalAxiosRequestConfig, 
  AxiosResponse 
} from "axios";

/**
 * =========================================
 * Interfaces & Types
 * =========================================
 */
interface ApiErrorResponse {
  message?: string;
  error?: Array<{ message: string }>;
}

/**
 * =========================================
 * Axios Client Configuration
 * =========================================
 */
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: Number(process.env.NEXT_PUBLIC_API_TIMEOUT) || 30000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

/**
 * =========================================
 * Active request controllers (for cancellation)
 * =========================================
 */
const controllers = new Map<string, AbortController>();

/**
 * =========================================
 * Helper: Extract error message safely
 * =========================================
 */
function extractErrorMessage(error: AxiosError<ApiErrorResponse>): string {
  return (
    error?.response?.data?.error?.[0]?.message ||
    error?.response?.data?.message ||
    error?.message ||
    "An unexpected error occurred"
  );
}

/**
 * =========================================
 * Request Interceptor
 * =========================================
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // ✅ Prevent SSR crash (Next.js)
    if (typeof window !== "undefined") {
      const tokenKey = process.env.NEXT_PUBLIC_ACCESS_TOKEN_KEY || "access_token";
      const token = localStorage.getItem(tokenKey);

      // Attach Bearer token using the specific Axios headers object
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    // 🔹 Create unique request key (for cancellation)
    const requestKey = `${config.url}_${JSON.stringify(config.params || {})}_${config.method || "get"}`;

    // 🔹 Cancel previous request if still active
    if (controllers.has(requestKey)) {
      controllers.get(requestKey)?.abort();
      controllers.delete(requestKey);
    }

    // 🔹 Create new AbortController
    const controller = new AbortController();
    config.signal = controller.signal;
    controllers.set(requestKey, controller);

    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * =========================================
 * Response Interceptor
 * =========================================
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    const requestKey = `${response.config.url}_${JSON.stringify(response.config.params || {})}_${response.config.method || "get"}`;

    // Remove completed request
    controllers.delete(requestKey);

    return response;
  },
  (error: AxiosError<ApiErrorResponse>) => {
    // 🔹 Request canceled
    if (axios.isCancel(error)) {
      return Promise.resolve({ canceled: true });
    }

    // 🔹 Unauthorized (401) → logout
    if (error.response?.status === 401 && typeof window !== "undefined") {
      console.warn("Unauthorized - token expired");

      const tokenKey = process.env.NEXT_PUBLIC_ACCESS_TOKEN_KEY || "access_token";
      const refreshKey = process.env.NEXT_PUBLIC_REFRESH_TOKEN_KEY || "refresh_token";
      const userKey = process.env.NEXT_PUBLIC_USER_KEY || "user_data";

      localStorage.removeItem(tokenKey);
      localStorage.removeItem(refreshKey);
      localStorage.removeItem(userKey);

      window.location.href = process.env.NEXT_PUBLIC_LOGIN_ROUTE || "/login";
    }

    // 🔹 Return clean error message (rejected)
    return Promise.reject(extractErrorMessage(error));
  }
);
