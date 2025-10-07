/**
 * Authentication API Client
 * Handles all authentication-related API calls to the API Gateway
 */

import axios, { AxiosInstance, AxiosError } from 'axios';
import {
  LoginCredentials,
  RegisterData,
  TokenResponse,
  User,
  PasswordResetRequest,
  PasswordResetConfirm,
  PasswordChange,
  UserUpdate,
  SessionInfo,
} from '@/types/auth';

// Get API Gateway URL from environment or default to localhost
const API_GATEWAY_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:8000';
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
      (error) => Promise.reject(error)
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
              this.setTokens(response.accessToken, response.refreshToken);
              
              // Retry original request with new token
              originalRequest.headers.Authorization = `Bearer ${response.accessToken}`;
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
      }
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
   */
  async register(data: RegisterData): Promise<User> {
    const response = await this.client.post<User>('/register', {
      email: data.email,
      password: data.password,
      first_name: data.firstName,
      last_name: data.lastName,
      role: data.role || 'viewer',
    });
    return response.data;
  }

  /**
   * Login user
   */
  async login(credentials: LoginCredentials): Promise<TokenResponse> {
    const response = await this.client.post<TokenResponse>('/login', credentials);
    const data = response.data;
    
    // Store tokens
    this.setTokens(data.accessToken, data.refreshToken);
    
    return data;
  }

  /**
   * Logout user
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
   */
  async refreshToken(refreshToken: string): Promise<TokenResponse> {
    const response = await this.client.post<TokenResponse>('/refresh', {
      refresh_token: refreshToken,
    });
    return response.data;
  }

  /**
   * Get current user info
   */
  async getCurrentUser(): Promise<User> {
    const response = await this.client.get<User>('/me');
    return response.data;
  }

  /**
   * Update user profile
   */
  async updateProfile(data: UserUpdate): Promise<User> {
    const response = await this.client.put<User>('/me', {
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
    });
    return response.data;
  }

  /**
   * Change password
   */
  async changePassword(data: PasswordChange): Promise<{ message: string }> {
    const response = await this.client.post('/password/change', {
      old_password: data.oldPassword,
      new_password: data.newPassword,
    });
    return response.data;
  }

  /**
   * Request password reset
   */
  async requestPasswordReset(data: PasswordResetRequest): Promise<{ message: string }> {
    const response = await this.client.post('/password/reset', data);
    return response.data;
  }

  /**
   * Confirm password reset
   */
  async confirmPasswordReset(data: PasswordResetConfirm): Promise<{ message: string }> {
    const response = await this.client.post('/password/reset/confirm', {
      token: data.token,
      new_password: data.newPassword,
    });
    return response.data;
  }

  /**
   * Get user sessions
   */
  async getSessions(): Promise<SessionInfo[]> {
    const response = await this.client.get<SessionInfo[]>('/sessions');
    return response.data;
  }

  /**
   * Revoke a specific session
   */
  async revokeSession(sessionId: number): Promise<{ message: string }> {
    const response = await this.client.delete(`/sessions/${sessionId}`);
    return response.data;
  }

  /**
   * Revoke all sessions except current
   */
  async revokeAllSessions(): Promise<{ message: string }> {
    const response = await this.client.delete('/sessions');
    return response.data;
  }

  // Admin endpoints

  /**
   * Get all users (admin only)
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
   */
  async updateUserStatus(userId: number, status: string): Promise<User> {
    const response = await this.client.put<User>(`/users/${userId}/status`, { status });
    return response.data;
  }

  /**
   * Update user role (admin only)
   */
  async updateUserRole(userId: number, role: string): Promise<User> {
    const response = await this.client.put<User>(`/users/${userId}/role`, { role });
    return response.data;
  }

  /**
   * Delete user (admin only)
   */
  async deleteUser(userId: number): Promise<{ message: string }> {
    const response = await this.client.delete(`/users/${userId}`);
    return response.data;
  }
}

// Export singleton instance
export const authClient = new AuthClient();
export default authClient;

