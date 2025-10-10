import { AppProps } from 'next/app';
import Head from 'next/head';
import { Spin } from 'antd';
import posthog from 'posthog-js';
import apolloClient from '@/apollo/client';
import { GlobalConfigProvider } from '@/hooks/useGlobalConfig';
import { PostHogProvider } from 'posthog-js/react';
import { ApolloProvider } from '@apollo/client';
import { defaultIndicator } from '@/components/PageLoading';
import { ThemeProvider } from '@/hooks/useTheme';
import { AuthProvider } from '@/hooks/useAuth';
import ErrorBoundary from '@/components/ErrorBoundary';

require('../styles/index.less');
require('../styles/tailwind.css');
require('../styles/theme.css');
require('../styles/animations.css');

Spin.setDefaultIndicator(defaultIndicator);

// Initialize error logging in development
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  import('../utils/errorLogger').then(({ initializeErrorLogging }) => {
    initializeErrorLogging();
  });
}

// Suppress defaultProps warnings from Ant Design v4 in development
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  const originalConsoleError = console.error;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Support for defaultProps will be removed')
    ) {
      return;
    }
    originalConsoleError(...args);
  };
}

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>TrendRadarAI</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ErrorBoundary>
        <ThemeProvider>
          <AuthProvider>
            <GlobalConfigProvider>
              <ApolloProvider client={apolloClient}>
                <PostHogProvider client={posthog}>
                  <main className="app">
                    <Component {...pageProps} />
                  </main>
                </PostHogProvider>
              </ApolloProvider>
            </GlobalConfigProvider>
          </AuthProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </>
  );
}

export default App;
