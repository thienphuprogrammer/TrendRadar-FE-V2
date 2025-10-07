import React from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { ConfigProvider, Spin } from 'antd';
import posthog from 'posthog-js';
import apolloClient from '@/apollo/client';
import { GlobalConfigProvider } from '@/hooks/useGlobalConfig';
import { PostHogProvider as RealPostHogProvider } from 'posthog-js/react';
import { ApolloProvider } from '@apollo/client';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import SkipToMain from '@/components/SkipToMain';
import { defaultIndicator } from '@/components/PageLoading';

require('../styles/index.less');
require('../styles/accessibility.css');
require('../styles/modern-ui.css');

Spin.setDefaultIndicator(defaultIndicator);

function App({ Component, pageProps }: AppProps) {
  const PostHogProvider =
    (RealPostHogProvider as any) || (({ children }: any) => <>{children}</>);
  return (
    <>
      <Head>
        <title>Wren AI</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <ThemeProvider>
        <ConfigProvider>
          <AuthProvider>
            <GlobalConfigProvider>
              <ApolloProvider client={apolloClient}>
                <PostHogProvider client={posthog}>
                  <SkipToMain />
                  <main id="main-content" className="app" tabIndex={-1}>
                    <Component {...pageProps} />
                  </main>
                </PostHogProvider>
              </ApolloProvider>
            </GlobalConfigProvider>
          </AuthProvider>
        </ConfigProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
