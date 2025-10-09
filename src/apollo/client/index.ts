import { ApolloClient, HttpLink, InMemoryCache, from } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { RetryLink } from '@apollo/client/link/retry';
import errorHandler from '@/utils/errorHandler';

// Error handling link with minimal logging (only log once per error type)
const errorCache = new Set();

const apolloErrorLink = onError(({ graphQLErrors, networkError, operation }) => {
  const operationName = operation?.operationName || 'unknown';
  
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message }) => {
      const errorKey = `graphql-${operationName}-${message}`;
      if (!errorCache.has(errorKey)) {
        errorCache.add(errorKey);
        console.warn(`[GraphQL] ${operationName}: ${message.substring(0, 100)}`);
      }
    });
  }

  if (networkError) {
    const errorKey = `network-${operationName}`;
    if (!errorCache.has(errorKey)) {
      errorCache.add(errorKey);
      console.warn(`[Network] ${operationName}: Using fallback data`);
    }
    // Don't crash the app on network errors
  }

  // Call the existing error handler (it will show user-facing messages)
  errorHandler({ graphQLErrors, networkError, operation });
});

// Retry link for failed requests (reduced retries to minimize console noise)
const retryLink = new RetryLink({
  delay: {
    initial: 500,
    max: 2000,
    jitter: true,
  },
  attempts: {
    max: 1, // Reduced from 3 to 1 to minimize console errors
    retryIf: (error, _operation) => {
      // Only retry on network errors, not server errors (502/500)
      // Server errors likely won't resolve with retries
      return !!error && (
        error.message.includes('Failed to fetch') ||
        error.message.includes('NetworkError') ||
        error.message.includes('CORS')
      );
    },
  },
});

// HTTP link with credentials
const httpLink = new HttpLink({
  uri: '/api/graphql',
  credentials: 'same-origin',
});

const client = new ApolloClient({
  link: from([apolloErrorLink, retryLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all', // Return partial data even if there are errors
    },
    query: {
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
});

export default client;
