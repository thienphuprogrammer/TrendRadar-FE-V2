import { useWithOnboarding } from '@/hooks/useCheckOnboarding';
import PageLoading from '@/components/PageLoading';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function Index() {
  useWithOnboarding();

  return (
    <ProtectedRoute>
      <PageLoading visible />
    </ProtectedRoute>
  );
}
