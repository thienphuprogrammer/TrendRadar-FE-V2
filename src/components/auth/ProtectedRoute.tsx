/**
 * Protected Route Component
 * Wraps pages that require authentication
 */

import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import PageLoading from '@/components/PageLoading';
import { UserRole } from '@/types/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: UserRole[];
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles,
  redirectTo = '/auth/login',
}) => {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      // Not authenticated - redirect to login
      if (!isAuthenticated) {
        router.replace(
          `${redirectTo}?redirect=${encodeURIComponent(router.asPath)}`,
        );
        return;
      }

      // Check role requirements
      if (requiredRoles && user && !requiredRoles.includes(user.role)) {
        router.replace('/unauthorized');
      }
    }
  }, [isAuthenticated, isLoading, user, router, redirectTo, requiredRoles]);

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div role="status" aria-live="polite" aria-label="Loading authentication">
        <PageLoading visible />
      </div>
    );
  }

  // Not authenticated or wrong role
  if (
    !isAuthenticated ||
    (requiredRoles && user && !requiredRoles.includes(user.role))
  ) {
    return (
      <div role="status" aria-live="polite" aria-label="Redirecting">
        <PageLoading visible />
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
