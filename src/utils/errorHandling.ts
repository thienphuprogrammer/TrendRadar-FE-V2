// Error handling utilities and default data

export const DEFAULT_DATA = {
  threads: [],
  suggestedQuestions: [
    {
      label: 'Getting Started',
      question: 'What data do I have access to?',
    },
    {
      label: 'Analysis',
      question: 'Show me a summary of recent trends',
    },
    {
      label: 'Insights',
      question: 'What are the key insights from my data?',
    },
  ],
  models: [],
  relationships: [],
};

export interface ErrorWithRetry {
  message: string;
  canRetry: boolean;
  retry?: () => void;
}

export function handleGraphQLError(error: any): ErrorWithRetry {
  console.error('GraphQL Error:', error);

  // Network errors
  if (error.networkError) {
    return {
      message: 'Network error. Please check your connection.',
      canRetry: true,
    };
  }

  // GraphQL errors
  if (error.graphQLErrors && error.graphQLErrors.length > 0) {
    const firstError = error.graphQLErrors[0];
    return {
      message: firstError.message || 'An error occurred while fetching data.',
      canRetry: true,
    };
  }

  // Generic error
  return {
    message: 'An unexpected error occurred. Using default data.',
    canRetry: true,
  };
}

export function withFallback<T>(promise: Promise<T>, fallback: T): Promise<T> {
  return promise.catch((error) => {
    console.error('Error caught, using fallback:', error);
    return fallback;
  });
}

export function safelyParseJSON<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json);
  } catch (error) {
    console.error('JSON parse error, using fallback:', error);
    return fallback;
  }
}

export function retryWithBackoff(
  fn: () => Promise<any>,
  maxRetries = 3,
  delay = 1000,
): Promise<any> {
  return new Promise((resolve, reject) => {
    let retries = 0;

    const attempt = () => {
      fn()
        .then(resolve)
        .catch((error) => {
          if (retries < maxRetries) {
            retries++;
            console.log(`Retry attempt ${retries}/${maxRetries}`);
            setTimeout(attempt, delay * retries);
          } else {
            reject(error);
          }
        });
    };

    attempt();
  });
}

// Safe data access helpers
export function safeGet<T>(
  obj: any,
  path: string,
  defaultValue: T,
): T {
  const keys = path.split('.');
  let result = obj;

  for (const key of keys) {
    if (result == null) {
      return defaultValue;
    }
    result = result[key];
  }

  return result != null ? result : defaultValue;
}
