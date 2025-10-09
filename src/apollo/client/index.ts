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

// Retry link for failed requests
const retryLink = new RetryLink({
  delay: {
    initial: 300,
    max: 3000,
    jitter: true,
  },
  attempts: {
    max: 3,
    retryIf: (error, _operation) => {
      // Retry on network errors or 5xx server errors
      return !!error && (
        error.message.includes('Failed to fetch') ||
        error.message.includes('NetworkError') ||
        error.statusCode >= 500
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
