/**
 * API Error Handling Utilities
 * Standardized error handling for API requests
 */

import { AxiosError } from 'axios';
import { HTTP_STATUS, ERROR_MESSAGES } from './constants';

export interface ApiErrorResponse {
  message: string;
  detail?: string;
  errors?: Record<string, string[]>;
  status?: number;
}

/**
 * Custom API Error class
 */
export class ApiError extends Error {
  public status: number;
  public detail?: string;
  public errors?: Record<string, string[]>;

  constructor(message: string, status: number, detail?: string, errors?: Record<string, string[]>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.detail = detail;
    this.errors = errors;
  }
}

/**
 * Parse error from Axios error response
 */
export function parseAxiosError(error: AxiosError): ApiError {
  if (error.response) {
    // Server responded with error status
    const data = error.response.data as any;
    const status = error.response.status;
    
    const message = data?.detail || data?.message || getDefaultErrorMessage(status);
    const detail = data?.detail;
    const errors = data?.errors;

    return new ApiError(message, status, detail, errors);
  } else if (error.request) {
    // Request was made but no response received
    return new ApiError(
      ERROR_MESSAGES.NETWORK_ERROR,
      0,
      'No response from server'
    );
  } else {
    // Something else happened
    return new ApiError(
      error.message || ERROR_MESSAGES.UNKNOWN_ERROR,
      0
    );
  }
}

/**
 * Get default error message based on status code
 */
export function getDefaultErrorMessage(status: number): string {
  switch (status) {
    case HTTP_STATUS.BAD_REQUEST:
      return 'Invalid request. Please check your input.';
    case HTTP_STATUS.UNAUTHORIZED:
      return ERROR_MESSAGES.UNAUTHORIZED;
    case HTTP_STATUS.FORBIDDEN:
      return ERROR_MESSAGES.UNAUTHORIZED;
    case HTTP_STATUS.NOT_FOUND:
      return 'Resource not found.';
    case HTTP_STATUS.CONFLICT:
      return 'Conflict error. Resource already exists.';
    case HTTP_STATUS.INTERNAL_SERVER_ERROR:
      return 'Server error. Please try again later.';
    default:
      return ERROR_MESSAGES.UNKNOWN_ERROR;
  }
}

/**
 * Check if error is an authentication error
 */
export function isAuthError(error: ApiError | AxiosError): boolean {
  if (error instanceof ApiError) {
    return error.status === HTTP_STATUS.UNAUTHORIZED;
  }
  if (error instanceof Error && 'response' in error) {
    return (error as AxiosError).response?.status === HTTP_STATUS.UNAUTHORIZED;
  }
  return false;
}

/**
 * Check if error is a network error
 */
export function isNetworkError(error: ApiError | AxiosError): boolean {
  if (error instanceof ApiError) {
    return error.status === 0;
  }
  if (error instanceof Error && 'request' in error) {
    return !(error as AxiosError).response;
  }
  return false;
}

/**
 * Check if error is a validation error
 */
export function isValidationError(error: ApiError): boolean {
  return error.status === HTTP_STATUS.BAD_REQUEST && !!error.errors;
}

/**
 * Format validation errors for form display
 */
export function formatValidationErrors(error: ApiError): Record<string, string> {
  if (!error.errors) return {};
  
  const formatted: Record<string, string> = {};
  
  Object.entries(error.errors).forEach(([field, messages]) => {
    formatted[field] = messages.join(', ');
  });
  
  return formatted;
}

/**
 * Handle API error with optional custom handlers
 */
export function handleApiError(
  error: any,
  options?: {
    onAuthError?: () => void;
    onNetworkError?: () => void;
    onValidationError?: (errors: Record<string, string>) => void;
    onOtherError?: (error: ApiError) => void;
  }
): ApiError {
  let apiError: ApiError;

  if (error instanceof ApiError) {
    apiError = error;
  } else if (error.isAxiosError) {
    apiError = parseAxiosError(error as AxiosError);
  } else {
    apiError = new ApiError(
      error.message || ERROR_MESSAGES.UNKNOWN_ERROR,
      0
    );
  }

  // Call appropriate handler
  if (isAuthError(apiError) && options?.onAuthError) {
    options.onAuthError();
  } else if (isNetworkError(apiError) && options?.onNetworkError) {
    options.onNetworkError();
  } else if (isValidationError(apiError) && options?.onValidationError) {
    options.onValidationError(formatValidationErrors(apiError));
  } else if (options?.onOtherError) {
    options.onOtherError(apiError);
  }

  return apiError;
}

/**
 * Retry function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number;
    baseDelay?: number;
    maxDelay?: number;
    shouldRetry?: (error: any) => boolean;
  } = {}
): Promise<T> {
  const {
    maxRetries = 3,
    baseDelay = 1000,
    maxDelay = 10000,
    shouldRetry = (error) => isNetworkError(error),
  } = options;

  let lastError: any;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (attempt === maxRetries || !shouldRetry(error)) {
        throw error;
      }

      // Calculate delay with exponential backoff
      const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

