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
import ErrorBoundary from '@/components/ErrorBoundary';

require('../styles/index.less');
require('../styles/tailwind.css');
require('../styles/theme.css');

Spin.setDefaultIndicator(defaultIndicator);

// Initialize error logging in development
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  import('../utils/errorLogger').then(({ initializeErrorLogging }) => {
    initializeErrorLogging();
  });
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
          <GlobalConfigProvider>
            <ApolloProvider client={apolloClient}>
              <PostHogProvider client={posthog}>
                <main className="app">
                  <Component {...pageProps} />
                </main>
              </PostHogProvider>
            </ApolloProvider>
          </GlobalConfigProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </>
  );
}

export default App;
