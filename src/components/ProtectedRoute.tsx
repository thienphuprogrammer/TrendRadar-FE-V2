import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import { Spin, Result } from 'antd';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Array<'Admin' | 'Owner' | 'Analyst' | 'Viewer'>;
}

export default function ProtectedRoute({
  children,
  allowedRoles
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      // Redirect to login if not authenticated
      router.push(`/login?redirect=${encodeURIComponent(router.asPath)}`);
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect
  }

  // Check role permission
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div style={{ padding: '50px' }}>
        <Result
          status="403"
          title="403"
          subTitle="Sorry, you don't have permission to access this page."
          extra={
            <a href="/" style={{ color: '#1890ff' }}>
              Go to Dashboard
            </a>
          }
        />
      </div>
    );
  }

  return <>{children}</>;
}


