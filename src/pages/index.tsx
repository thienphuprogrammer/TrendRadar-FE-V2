import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import PageLoading from '@/components/PageLoading';

export default function Index() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Redirect to login if not authenticated
        router.push('/login');
      } else {
        // Redirect to dashboard if authenticated
        router.push('/dashboard');
      }
    }
  }, [user, loading, router]);

  return <PageLoading visible />;
}
