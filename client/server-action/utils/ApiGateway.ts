import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from "axios";

interface ApiErrorResponse {
  message?: string;
  error?: Array<{ message: string }>;
}

export const apiClient = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api`, timeout: Number(process.env.NEXT_PUBLIC_API_TIMEOUT) || 30000,
  headers: {
    Accept: "application/json",
  },
});

// Active request controllers for cancellation
const controllers = new Map<string, AbortController>();

function extractErrorMessage(error: AxiosError<ApiErrorResponse>): string {
  return (
    error?.response?.data?.error?.[0]?.message ||
    error?.response?.data?.message ||
    error?.message ||
    "An unexpected error occurred"
  );
}

// Request interceptor
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof window !== "undefined") {
    const tokenKey = process.env.NEXT_PUBLIC_ACCESS_TOKEN_KEY || "access_token";
    const token = localStorage.getItem(tokenKey);

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
 
  //Dynamic content type 
  config.headers = config.headers || {};
  if (config.data instanceof FormData) {
    if (config.headers) delete config.headers["Content-Type"];
  } else {
    if (config.headers) config.headers["Content-Type"] = "application/json";
  }


  //Cancel duplicate requests
  const requestKey = `${config.url}_${JSON.stringify(config.params || {})}_${config.method || "get"}`;

  if (controllers.has(requestKey)) {
    controllers.get(requestKey)?.abort();
    controllers.delete(requestKey);
  }

  const controller = new AbortController();
  config.signal = controller.signal;
  controllers.set(requestKey, controller);

  return config;
}, (error) => Promise.reject(error));

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    const requestKey = `${response.config.url}_${JSON.stringify(response.config.params || {})}_${response.config.method || "get"}`;
    controllers.delete(requestKey);
    return response;
  },
  (error: AxiosError<ApiErrorResponse>) => {
    if (axios.isCancel(error)) return new Promise(() => { });

    if (error.config) {
      const requestKey = `${error.config.url}_${JSON.stringify(error.config.params || {})}_${error.config.method || "get"}`;
      controllers.delete(requestKey);
    }

    if (error.response?.status === 401 && typeof window !== "undefined") {
      const tokenKey = process.env.NEXT_PUBLIC_ACCESS_TOKEN_KEY || "access_token";
      const refreshKey = process.env.NEXT_PUBLIC_REFRESH_TOKEN_KEY || "refresh_token";
      const userKey = process.env.NEXT_PUBLIC_USER_KEY || "user_data";

      localStorage.removeItem(tokenKey);
      localStorage.removeItem(refreshKey);
      localStorage.removeItem(userKey);

      window.location.href = process.env.NEXT_PUBLIC_LOGIN_ROUTE || "/login";
    }

    return Promise.reject(extractErrorMessage(error));
  }
);
