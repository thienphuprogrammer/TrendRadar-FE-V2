/**
 * Error Logger Utility
 * Provides structured error logging with helpful context
 */

export enum ErrorSeverity {
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  CRITICAL = 'CRITICAL',
}

export interface StructuredError {
  severity: ErrorSeverity;
  message: string;
  context?: string;
  error?: any;
  timestamp: Date;
  userImpact: string;
  resolution: string;
}

const isDevelopment = process.env.NODE_ENV === 'development';

/**
 * Log a structured error with helpful context
 */
export function logStructuredError(config: {
  severity: ErrorSeverity;
  message: string;
  context?: string;
  error?: any;
  userImpact: string;
  resolution: string;
  showInProduction?: boolean;
}) {
  const {
    severity,
    message,
    context,
    error,
    userImpact,
    resolution,
    showInProduction = false,
  } = config;

  // Only log in development or if explicitly enabled for production
  if (!isDevelopment && !showInProduction) {
    return;
  }

  const structuredError: StructuredError = {
    severity,
    message,
    context,
    error,
    timestamp: new Date(),
    userImpact,
    resolution,
  };

  // Format the output
  const style = getConsoleStyle(severity);
  const emoji = getEmoji(severity);

  console.groupCollapsed(`${emoji} ${severity}: ${message}`);
  console.log('%c📋 Details:', 'font-weight: bold');
  console.table({
    Severity: severity,
    Context: context || 'N/A',
    'User Impact': userImpact,
    Resolution: resolution,
    Timestamp: structuredError.timestamp.toISOString(),
  });

  if (error) {
    console.log('%c🔍 Error Details:', 'font-weight: bold; color: #f59e0b');
    console.error(error);
  }

  console.log(
    '%c💡 What this means:',
    'font-weight: bold; color: #3b82f6',
    `\n${userImpact}`
  );
  console.log(
    '%c✅ How to fix:',
    'font-weight: bold; color: #10b981',
    `\n${resolution}`
  );

  console.groupEnd();
}

function getConsoleStyle(severity: ErrorSeverity): string {
  switch (severity) {
    case ErrorSeverity.INFO:
      return 'color: #3b82f6; font-weight: bold';
    case ErrorSeverity.WARNING:
      return 'color: #f59e0b; font-weight: bold';
    case ErrorSeverity.ERROR:
      return 'color: #ef4444; font-weight: bold';
    case ErrorSeverity.CRITICAL:
      return 'color: #dc2626; font-weight: bold; font-size: 14px';
    default:
      return '';
  }
}

function getEmoji(severity: ErrorSeverity): string {
  switch (severity) {
    case ErrorSeverity.INFO:
      return 'ℹ️';
    case ErrorSeverity.WARNING:
      return '⚠️';
    case ErrorSeverity.ERROR:
      return '❌';
    case ErrorSeverity.CRITICAL:
      return '🚨';
    default:
      return '📝';
  }
}

/**
 * Log network errors with helpful context
 */
export function logNetworkError(
  url: string,
  statusCode: number,
  error: any
) {
  const errorMessages: Record<number, { userImpact: string; resolution: string }> = {
    502: {
      userImpact:
        'The backend service is temporarily unavailable. The app is using cached/default data, so you can continue working.',
      resolution:
        'This is usually temporary. The app will automatically retry when the service is back. No action needed from your side.',
    },
    503: {
      userImpact:
        'The service is temporarily unavailable due to maintenance or high load.',
      resolution:
        'Wait a few moments and try again. The app is using fallback data in the meantime.',
    },
    504: {
      userImpact:
        'The request took too long to complete. Using cached data.',
      resolution:
        'This might be due to slow network. The app will retry automatically.',
    },
    404: {
      userImpact:
        'The requested resource was not found. Using default data.',
      resolution:
        'This might be a configuration issue. Contact support if this persists.',
    },
    401: {
      userImpact: 'Authentication required or session expired.',
      resolution: 'You may need to log in again.',
    },
    403: {
      userImpact: "You don't have permission to access this resource.",
      resolution: 'Contact your administrator for access.',
    },
  };

  const errorInfo =
    errorMessages[statusCode] || errorMessages[502]; // Default to 502 message

  logStructuredError({
    severity: statusCode >= 500 ? ErrorSeverity.WARNING : ErrorSeverity.ERROR,
    message: `Network request failed (${statusCode})`,
    context: `Request to: ${url}`,
    error,
    userImpact: errorInfo.userImpact,
    resolution: errorInfo.resolution,
  });
}

/**
 * Log API errors with context
 */
export function logApiError(
  operation: string,
  error: any,
  usingFallback: boolean = false
) {
  logStructuredError({
    severity: usingFallback ? ErrorSeverity.WARNING : ErrorSeverity.ERROR,
    message: `API operation failed: ${operation}`,
    context: 'GraphQL API',
    error,
    userImpact: usingFallback
      ? 'Using default data. Most features are still available.'
      : 'This operation could not be completed.',
    resolution: usingFallback
      ? 'The app will automatically retry. No action needed.'
      : 'Please try again. If the issue persists, contact support.',
  });
}

/**
 * Log successful fallback usage
 */
export function logFallbackUsage(
  component: string,
  reason: string
) {
  if (!isDevelopment) return;

  console.log(
    '%c🔄 Using Fallback Data',
    'color: #3b82f6; font-weight: bold',
    `\nComponent: ${component}\nReason: ${reason}\n✅ App continues to work normally`
  );
}

/**
 * Initialize error logging system
 */
export function initializeErrorLogging() {
  if (!isDevelopment) return;

  console.log(
    '%c🛡️ Error Handling Active',
    'color: #10b981; font-weight: bold; font-size: 14px; padding: 8px',
    '\n\n' +
      '✅ Comprehensive error handling is enabled\n' +
      '✅ API failures will use fallback data\n' +
      '✅ Images have automatic fallbacks\n' +
      '✅ UI will never crash from network errors\n\n' +
      '💡 You may see some warnings below - these are expected and handled gracefully.\n' +
      '   The app will continue to function normally with cached/default data.\n'
  );

  // Log that we're ready
  logStructuredError({
    severity: ErrorSeverity.INFO,
    message: 'Error handling system initialized',
    context: 'Application startup',
    userImpact: 'None - this is informational',
    resolution: 'No action needed',
    showInProduction: false,
  });
}
