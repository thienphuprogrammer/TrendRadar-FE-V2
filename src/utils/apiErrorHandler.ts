/**
 * Comprehensive API Error Handler
 * Ensures the UI never crashes due to API failures
 */

import { message } from 'antd';
import { ApolloError } from '@apollo/client';

export interface ApiResponse<T> {
  data: T | null;
  error: Error | null;
  success: boolean;
}

export interface SafeApiCallOptions {
  showErrorToUser?: boolean;
  errorMessage?: string;
  defaultValue?: any;
  silentError?: boolean;
  onError?: (error: Error) => void;
  onSuccess?: (data: any) => void;
}

/**
 * Safely execute an async API call with comprehensive error handling
 * 
 * @param apiCall - The async function to execute
 * @param options - Configuration options
 * @returns Promise with data, error, and success status
 * 
 * @example
 * ```tsx
 * const { data, error, success } = await safeApiCall(
 *   () => fetchUser(userId),
 *   {
 *     showErrorToUser: true,
 *     errorMessage: 'Failed to load user',
 *     defaultValue: { name: 'Guest' }
 *   }
 * );
 * ```
 */
export async function safeApiCall<T>(
  apiCall: () => Promise<T>,
  options: SafeApiCallOptions = {}
): Promise<ApiResponse<T>> {
  const {
    showErrorToUser = false, // Silent by default
    errorMessage = 'An error occurred',
    defaultValue = null,
    silentError = true, // Silent by default
    onError,
    onSuccess,
  } = options;

  try {
    const data = await apiCall();
    
    if (onSuccess) {
      onSuccess(data);
    }

    return {
      data,
      error: null,
      success: true,
    };
  } catch (error: any) {
    // Log error for debugging (only in development)
    if (!silentError && process.env.NODE_ENV === 'development') {
      console.error('API call failed:', error);
    }

    // Show error to user if explicitly configured (default is silent)
    if (showErrorToUser) {
      const displayMessage = getErrorMessage(error, errorMessage);
      message.error(displayMessage, 5);
    }

    // Call error callback if provided
    if (onError) {
      onError(error);
    }

    return {
      data: defaultValue,
      error: error instanceof Error ? error : new Error(String(error)),
      success: false,
    };
  }
}

/**
 * Get a user-friendly error message from various error types
 */
export function getErrorMessage(error: any, fallback: string = 'An unexpected error occurred'): string {
  // Apollo/GraphQL errors
  if (error instanceof ApolloError) {
    if (error.networkError) {
      return 'Network error. Please check your internet connection.';
    }
    
    if (error.graphQLErrors && error.graphQLErrors.length > 0) {
      return error.graphQLErrors[0].message;
    }
  }

  // Standard Error
  if (error instanceof Error) {
    return error.message;
  }

  // Network errors
  if (error?.message?.includes('Network request failed')) {
    return 'Unable to connect to the server. Please check your connection.';
  }

  // Timeout errors
  if (error?.message?.includes('timeout')) {
    return 'Request timed out. Please try again.';
  }

  // 400 Bad Request
  if (error?.status === 400 || error?.statusCode === 400) {
    return error?.message || 'Invalid request. Please check your input.';
  }

  // 401 Unauthorized
  if (error?.status === 401 || error?.statusCode === 401) {
    return 'Unauthorized. Please log in again.';
  }

  // 403 Forbidden
  if (error?.status === 403 || error?.statusCode === 403) {
    return 'You don\'t have permission to perform this action.';
  }

  // 404 Not Found
  if (error?.status === 404 || error?.statusCode === 404) {
    return 'The requested resource was not found.';
  }

  // 500 Server Error
  if (error?.status >= 500 || error?.statusCode >= 500) {
    return 'Server error. Please try again later.';
  }

  return fallback;
}

/**
 * Safely parse JSON with fallback
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json);
  } catch (error) {
    console.error('Failed to parse JSON:', error);
    return fallback;
  }
}

/**
 * Safely access nested object properties
 */
export function safeGet<T>(
  obj: any,
  path: string | string[],
  defaultValue: T
): T {
  try {
    const keys = Array.isArray(path) ? path : path.split('.');
    let result = obj;

    for (const key of keys) {
      if (result == null || typeof result !== 'object') {
        return defaultValue;
      }
      result = result[key];
    }

    return result !== undefined && result !== null ? result : defaultValue;
  } catch (error) {
    console.error('Error accessing object property:', error);
    return defaultValue;
  }
}

/**
 * Create a safe wrapper for async functions
 */
export function createSafeAsyncWrapper<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options: SafeApiCallOptions = {}
): (...args: Parameters<T>) => Promise<ApiResponse<Awaited<ReturnType<T>>>> {
  return async (...args: Parameters<T>) => {
    return safeApiCall(() => fn(...args), options);
  };
}

/**
 * Batch API calls with error handling for each
 */
export async function safeBatchApiCalls<T>(
  apiCalls: Array<() => Promise<T>>,
  options: SafeApiCallOptions = {}
): Promise<Array<ApiResponse<T>>> {
  const results = await Promise.allSettled(
    apiCalls.map(call => safeApiCall(call, { ...options, showErrorToUser: false }))
  );

  return results.map(result => {
    if (result.status === 'fulfilled') {
      return result.value;
    }
    
    return {
      data: options.defaultValue || null,
      error: new Error('API call failed'),
      success: false,
    };
  });
}

/**
 * Retry an API call with exponential backoff
 */
export async function retryApiCall<T>(
  apiCall: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000,
  options: SafeApiCallOptions = {}
): Promise<ApiResponse<T>> {
  let lastError: Error | null = null;
  let delay = initialDelay;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const result = await safeApiCall(apiCall, {
      ...options,
      showErrorToUser: false,
      silentError: attempt < maxRetries - 1,
    });

    if (result.success) {
      return result;
    }

    lastError = result.error;

    // Don't delay after last attempt
    if (attempt < maxRetries - 1) {
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2; // Exponential backoff
    }
  }

  // Show error only after all retries failed (if explicitly configured)
  if (options.showErrorToUser && lastError) {
    const errorMsg = getErrorMessage(lastError, options.errorMessage);
    message.error(errorMsg, 5);
  }

  return {
    data: options.defaultValue || null,
    error: lastError,
    success: false,
  };
}

/**
 * Wrap a promise with a timeout
 */
export async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number = 30000,
  timeoutError: string = 'Request timed out'
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(timeoutError)), timeoutMs)
    ),
  ]);
}
