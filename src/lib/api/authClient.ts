/**
 * Authentication API Client
 * Handles all authentication-related API calls to the API Gateway
 */

import axios, { AxiosError, AxiosInstance } from 'axios';
import {
  LoginCredentials,
  PasswordChange,
  PasswordResetConfirm,
  PasswordResetRequest,
  RegisterData,
  SessionInfo,
  TokenResponse,
  User,
  UserUpdate,
} from '@/types/auth';

// Get API Gateway URL from environment or default to localhost
const API_GATEWAY_URL =
  process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:8000';
const AUTH_BASE_URL = `${API_GATEWAY_URL}/api/v1/auth`;

/**
 * Auth API client configuration
 */
class AuthClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: AUTH_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getAccessToken();
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
      async (error: AxiosError) => {
        const originalRequest = error.config as any;

        // If 401 and not already retrying, try to refresh token
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = this.getRefreshToken();
            if (refreshToken) {
              const response = await this.refreshToken(refreshToken);
              // Store new tokens
              this.setTokens(response.access_token, response.refresh_token);

              // Retry original request with new token
              originalRequest.headers.Authorization = `Bearer ${response.access_token}`;
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            // Refresh failed, clear tokens and redirect to login
            this.clearTokens();
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

  // Token management
  getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('accessToken');
  }

  getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('refreshToken');
  }

  setTokens(accessToken: string, refreshToken: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  clearTokens(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  // Authentication endpoints

  /**
   * Register a new user
   * Returns user data. After registration, tokens should be obtained via login.
   */
  async register(data: RegisterData): Promise<User> {
    const response = await this.client.post<User>('/register', {
      email: data.email,
      password: data.password,
      first_name: data.first_name,
      last_name: data.last_name,
      role: data.role || 'seller',
    });
    return response.data;
  }

  /**
   * Login user
   * Automatically stores access_token and refresh_token in localStorage
   */
  async login(credentials: LoginCredentials): Promise<TokenResponse> {
    const response = await this.client.post<TokenResponse>(
      '/login',
      credentials,
    );
    const data = response.data;

    // Store tokens in localStorage for use in other APIs
    this.setTokens(data.access_token, data.refresh_token);

    return data;
  }

  /**
   * Logout user
   * Revokes the current session and clears stored tokens
   */
  async logout(): Promise<void> {
    try {
      await this.client.post('/logout');
    } finally {
      this.clearTokens();
    }
  }

  /**
   * Refresh access token
   * Gets a new access_token using the refresh_token
   * Note: This bypasses the auth interceptor to avoid sending expired token
   */
  async refreshToken(refreshToken: string): Promise<TokenResponse> {
    const response = await axios.post<TokenResponse>(
      `${AUTH_BASE_URL}/refresh`,
      {
        refresh_token: refreshToken,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      },
    );
    return response.data;
  }

  /**
   * Get current user info
   * Requires valid access_token in Authorization header
   */
  async getCurrentUser(): Promise<User> {
    const response = await this.client.get<User>('/me', {
      params: { token_type: 'access' },
    });
    return response.data;
  }

  /**
   * Update user profile
   * Requires valid access_token in Authorization header
   */
  async updateProfile(data: UserUpdate): Promise<User> {
    const response = await this.client.put<User>('/me', data);
    return response.data;
  }

  /**
   * Change password
   * Requires valid access_token in Authorization header
   */
  async changePassword(data: PasswordChange): Promise<{ message: string }> {
    const response = await this.client.post('/change-password', data);
    return response.data;
  }

  /**
   * Request password reset
   * Sends password reset email
   */
  async requestPasswordReset(
    data: PasswordResetRequest,
  ): Promise<{ message: string }> {
    const response = await this.client.post('/forgot-password', data);
    return response.data;
  }

  /**
   * Confirm password reset
   * Resets password with the provided token
   */
  async confirmPasswordReset(
    data: PasswordResetConfirm,
  ): Promise<{ message: string }> {
    const response = await this.client.post('/reset-password', data);
    return response.data;
  }

  /**
   * Get user sessions
   * Requires valid access_token in Authorization header
   */
  async getSessions(): Promise<SessionInfo[]> {
    const response = await this.client.get<SessionInfo[]>('/sessions');
    return response.data;
  }

  /**
   * Revoke a specific session
   * Requires valid access_token in Authorization header
   */
  async revokeSession(sessionId: number): Promise<{ message: string }> {
    const response = await this.client.delete(`/sessions/${sessionId}`);
    return response.data;
  }

  /**
   * Revoke all sessions
   * Requires valid access_token in Authorization header
   */
  async revokeAllSessions(): Promise<{ message: string }> {
    const response = await this.client.delete('/sessions');
    return response.data;
  }

  // Admin endpoints

  /**
   * Get all users (admin only)
   * Requires valid access_token in Authorization header
   */
  async getUsers(params?: {
    skip?: number;
    limit?: number;
    role?: string;
    status?: string;
    search?: string;
  }): Promise<User[]> {
    const response = await this.client.get<User[]>('/users', { params });
    return response.data;
  }

  /**
   * Update user status (admin only)
   * Requires valid access_token in Authorization header
   */
  async updateUserStatus(userId: number, newStatus: string): Promise<User> {
    const response = await this.client.put<User>(
      `/users/${userId}/status`,
      null,
      {
        params: { new_status: newStatus },
      },
    );
    return response.data;
  }
}

// Export singleton instance
export const authClient = new AuthClient();
export default authClient;
