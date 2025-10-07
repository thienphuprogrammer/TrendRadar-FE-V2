/**
 * Authentication types and interfaces
 */

export enum UserRole {
  ADMIN = 'admin',
  ANALYST = 'analyst',
  DEVELOPER = 'developer',
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
  firstName?: string;
  lastName?: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role?: UserRole;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
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
  newPassword: string;
}

export interface PasswordChange {
  oldPassword: string;
  newPassword: string;
}

export interface UserUpdate {
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface SessionInfo {
  id: number;
  userId: number;
  ipAddress?: string;
  userAgent?: string;
  lastActivityAt: string;
  createdAt: string;
}

