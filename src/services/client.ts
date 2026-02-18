/**
 * API Client - Axios instance with JWT interceptors
 * Minimal implementation for House Hunting App
 */

import axios from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';

/**
 * Axios instance configured with:
 * - Base URL from environment (defaults to http://localhost:3000/api)
 * - 10 second timeout
 * - JWT Bearer token in Authorization header (added via interceptor)
 * - Automatic logout on 401 unauthorized
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Add JWT token to headers
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: Handle auth errors (401)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

/**
 * Generic API call handler
 * @param promise - Axios promise to resolve
 * @returns Extracted data from response or throws error
 * 
 * Usage: 
 *   const user = await handleApiCall(apiClient.get('/users/me'))
 */
export const handleApiCall = async <T>(
  promise: Promise<AxiosResponse<{ success: boolean; data?: T; error?: string }>>
): Promise<T> => {
  try {
    const response = await promise;
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'API Error');
  } catch (error: any) {
    throw error.response?.data?.error || error.message || 'Request failed';
  }
};

export default apiClient;
