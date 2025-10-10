import { useRouter } from 'next/router';
import { createContext, useContext, useEffect, useState } from 'react';
import { getUserConfig, UserConfig } from '@/utils/env';
import { trackUserTelemetry } from '@/utils/telemetry';

type ContextProps = {
  config?: UserConfig | null;
  isOffline?: boolean;
};

const GlobalConfigContext = createContext<ContextProps>({
  isOffline: false,
});

export const GlobalConfigProvider = ({ children }) => {
  const router = useRouter();
  const [config, setConfig] = useState<UserConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    let cleanup: (() => void) | undefined;

    const loadConfig = async () => {
      try {
        setIsLoading(true);
        setIsOffline(false);
        const userConfig = await getUserConfig();
        setConfig(userConfig);

        // telemetry setup - only if enabled
        if (userConfig.isTelemetryEnabled) {
          cleanup = trackUserTelemetry(router, userConfig);
        }
      } catch (error) {
        const errorMessage = error?.message || '';
        const isNetworkError =
          errorMessage.includes('NetworkError') ||
          errorMessage.includes('Failed to fetch') ||
          errorMessage.includes('502') ||
          errorMessage.includes('CORS');

        setIsOffline(isNetworkError);

        // Set a default config so the app can continue
        setConfig({
          isTelemetryEnabled: false,
          telemetryKey: '',
          telemetryHost: '',
          userUUID: 'default-user',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadConfig();

    return () => {
      if (cleanup) {
        cleanup();
      }
    };
  }, [router]);

  const value = {
    config,
    isOffline,
  };

  // Always render children, even if config is loading
  // This prevents blocking the entire app
  return (
    <GlobalConfigContext.Provider value={value}>
      {children}
    </GlobalConfigContext.Provider>
  );
};

export default function useGlobalConfig() {
  return useContext(GlobalConfigContext);
}
