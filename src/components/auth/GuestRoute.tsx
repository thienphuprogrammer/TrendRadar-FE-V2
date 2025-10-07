/**
 * Guest Route Component
 * Wraps auth pages (login, register) - redirects authenticated users
 */

import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import PageLoading from '@/components/PageLoading';

interface GuestRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const GuestRoute: React.FC<GuestRouteProps> = ({
  children,
  redirectTo = '/',
}) => {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      const redirect = router.query.redirect as string;
      router.replace(redirect || redirectTo);
    }
  }, [isAuthenticated, isLoading, router, redirectTo]);

  // Show loading while checking auth
  if (isLoading) {
    return <PageLoading visible />;
  }

  // Already authenticated
  if (isAuthenticated) {
    return <PageLoading visible />;
  }

  return <>{children}</>;
};

export default GuestRoute;
