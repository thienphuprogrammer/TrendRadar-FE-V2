/**
 * API Client for making authenticated requests
 * Automatically includes the access_token in requests
 */

import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { authClient } from './authClient';

// Get API Gateway URL from environment or default to localhost
const API_GATEWAY_URL =
  process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:8000';

/**
 * Creates an Axios instance with automatic token injection
 * Use this client for all API calls that require authentication
 */
class APIClient {
  private client: AxiosInstance;

  constructor(baseURL: string = API_GATEWAY_URL) {
    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });

    // Request interceptor to add access_token
    this.client.interceptors.request.use(
      (config) => {
        const token = authClient.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    // Response interceptor to handle token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config as any;

        // If 401 and not already retrying, try to refresh token
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = authClient.getRefreshToken();
            if (refreshToken) {
              const response = await authClient.refreshToken(refreshToken);
              authClient.setTokens(response.access_token, response.refresh_token);

              // Retry original request with new token
              originalRequest.headers.Authorization = `Bearer ${response.access_token}`;
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            // Refresh failed, clear tokens and redirect to login
            authClient.clearTokens();
            if (typeof window !== 'undefined') {
              window.location.href = '/auth/login';
            }
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      },
    );
  }

  /**
   * Get the underlying Axios instance
   */
  getInstance(): AxiosInstance {
    return this.client;
  }

  /**
   * Make a GET request
   */
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  /**
   * Make a POST request
   */
  async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  /**
   * Make a PUT request
   */
  async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  /**
   * Make a PATCH request
   */
  async patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }

  /**
   * Make a DELETE request
   */
  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }
}

// Export singleton instance
export const apiClient = new APIClient();
export default apiClient;

