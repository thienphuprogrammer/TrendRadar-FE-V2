/**
 * Authentication types and interfaces
 * Based on TrendRadar Authentication Service API v1.0.0
 */

export enum UserRole {
  ADMIN = 'admin',
  ANALYST = 'analyst',
  VIEWER = 'viewer',
  SELLER = 'seller',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  SUSPENDED = 'suspended',
}

export interface User {
  id: number;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  full_name: string;
  role: UserRole;
  status: UserStatus;
  is_active: boolean;
  is_verified: boolean;
  phone?: string | null;
  company?: string | null;
  bio?: string | null;
  avatar_url?: string | null;
  created_at: string;
  updated_at: string;
  last_login?: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  first_name?: string | null;
  last_name?: string | null;
  role?: UserRole;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  new_password: string;
}

export interface PasswordChange {
  old_password: string;
  new_password: string;
}

export interface UserUpdate {
  first_name?: string | null;
  last_name?: string | null;
  phone?: string | null;
  company?: string | null;
  bio?: string | null;
  avatar_url?: string | null;
}

export interface SessionInfo {
  id: number;
  user_id: number;
  ip_address?: string | null;
  user_agent?: string | null;
  is_active: boolean;
  created_at: string;
  expires_at: string;
  last_accessed: string;
}
