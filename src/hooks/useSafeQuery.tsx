import { useState, useEffect } from 'react';
import { ApolloError } from '@apollo/client';
import { handleGraphQLError } from '@/utils/errorHandling';

interface UseSafeQueryOptions<T> {
  query: () => Promise<T>;
  defaultData: T;
  onSuccess?: (data: T) => void;
  onError?: (error: ApolloError) => void;
  retryCount?: number;
}

interface UseSafeQueryResult<T> {
  data: T;
  loading: boolean;
  error: ApolloError | null;
  retry: () => void;
}

export function useSafeQuery<T>({
  query,
  defaultData,
  onSuccess,
  onError,
  retryCount = 3,
}: UseSafeQueryOptions<T>): UseSafeQueryResult<T> {
  const [data, setData] = useState<T>(defaultData);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<ApolloError | null>(null);
  const [attempts, setAttempts] = useState<number>(0);

  const executeQuery = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await query();
      setData(result);
      onSuccess?.(result);
      setAttempts(0);
    } catch (err: any) {
      const errorInfo = handleGraphQLError(err);
      if (process.env.NODE_ENV === 'development') {
        console.error('Query error:', errorInfo.message);
      }
      setError(err);
      onError?.(err);

      // Auto-retry with exponential backoff
      if (attempts < retryCount && errorInfo.canRetry) {
        const delay = Math.pow(2, attempts) * 1000;
        setTimeout(() => {
          setAttempts(prev => prev + 1);
        }, delay);
      } else {
        // Use default data if all retries failed
        setData(defaultData);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    executeQuery();
  }, [attempts]);

  const retry = () => {
    setAttempts(0);
    executeQuery();
  };

  return { data, loading, error, retry };
}
