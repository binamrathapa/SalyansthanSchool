import axios, { 
  InternalAxiosRequestConfig, 
  AxiosHeaders 
} from 'axios';

/**
 * Create an instance of axios with custom configuration
 */
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor
 * We use InternalAxiosRequestConfig as it is the type expected by interceptors
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 1. Handle Token (Ensure this only runs on the client side for Next.js)
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        // Use .set() or direct assignment; AxiosHeaders handles the normalization
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    // 2. Handle Content-Type for FormData
    if (config.data instanceof FormData) {
      config.headers['Content-Type'] = 'multipart/form-data';
    } else {
      config.headers['Content-Type'] = 'application/json';
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;