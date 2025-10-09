import { ApolloClient, HttpLink, InMemoryCache, from } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { RetryLink } from '@apollo/client/link/retry';
import errorHandler from '@/utils/errorHandler';

// Error handling link with enhanced logging
const apolloErrorLink = onError(({ graphQLErrors, networkError, operation }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.warn(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
      );
    });
  }

  if (networkError) {
    console.warn(`[Network error]: ${networkError.message}`);
    // Don't crash the app on network errors
  }

  // Call the existing error handler
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
