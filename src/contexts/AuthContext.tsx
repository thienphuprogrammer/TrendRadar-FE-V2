/**
 * Authentication Context Provider
 * Manages authentication state and provides auth methods to the app
 */

import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useRouter } from 'next/router';
import { message } from 'antd';
import {
  AuthState,
  LoginCredentials,
  PasswordChange,
  RegisterData,
  UserUpdate,
} from '@/types/auth';
import { authClient } from '@/lib/api/authClient';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: UserUpdate) => Promise<void>;
  changePassword: (data: PasswordChange) => Promise<void>;
  refreshUser: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // Initialize auth state on mount
  useEffect(() => {
    const initAuth = async () => {
      const accessToken = authClient.getAccessToken();
      const refreshToken = authClient.getRefreshToken();

      if (accessToken) {
        try {
          const user = await authClient.getCurrentUser();
          setState({
            user,
            accessToken,
            refreshToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          console.error('Failed to load user:', error);
          authClient.clearTokens();
          setState({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      } else {
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    };

    initAuth();
  }, []);

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));

        // Login returns TokenResponse with access_token and refresh_token
        const tokenResponse = await authClient.login(credentials);
        const user = await authClient.getCurrentUser();

        setState({
          user,
          accessToken: tokenResponse.access_token,
          refreshToken: tokenResponse.refresh_token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });

        message.success('Đăng nhập thành công!');
        router.push('/');
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.detail || 'Đăng nhập thất bại. Vui lòng thử lại.';
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
        }));
        message.error(errorMessage);
        throw error;
      }
    },
    [router],
  );

  const register = useCallback(
    async (data: RegisterData) => {
      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));

        // Register returns UserResponse, not tokens
        await authClient.register(data);

        // Auto-login after registration to get tokens
        await login({
          email: data.email,
          password: data.password,
        });

        message.success('Đăng ký thành công! Chào mừng đến với TrendRadar.');
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.detail ||
          'Đăng ký thất bại. Vui lòng thử lại.';
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
        }));
        message.error(errorMessage);
        throw error;
      }
    },
    [login],
  );

  const logout = useCallback(async () => {
    try {
      await authClient.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setState({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
      message.info('Đăng xuất thành công');
      router.push('/auth/login');
    }
  }, [router]);

  const updateProfile = useCallback(async (data: UserUpdate) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const updatedUser = await authClient.updateProfile(data);

      setState((prev) => ({
        ...prev,
        user: updatedUser,
        isLoading: false,
      }));

      message.success('Cập nhật thông tin thành công!');
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail || 'Cập nhật thông tin thất bại';
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      message.error(errorMessage);
      throw error;
    }
  }, []);

  const changePassword = useCallback(async (data: PasswordChange) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      await authClient.changePassword(data);

      setState((prev) => ({ ...prev, isLoading: false }));

      message.success('Đổi mật khẩu thành công!');
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail || 'Đổi mật khẩu thất bại';
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      message.error(errorMessage);
      throw error;
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const user = await authClient.getCurrentUser();
      setState((prev) => ({ ...prev, user }));
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  }, []);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    refreshUser,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook to use auth context
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
