const env = {
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
};

export default env;

export type UserConfig = {
  isTelemetryEnabled: boolean;
  telemetryKey: string;
  telemetryHost: string;
  userUUID: string;
};

// Default user configuration fallback
const DEFAULT_USER_CONFIG: UserConfig = {
  isTelemetryEnabled: false,
  telemetryKey: '',
  telemetryHost: '',
  userUUID: 'default-user',
};

// Get the user configuration
export const getUserConfig = async (): Promise<UserConfig> => {
  try {
    const response = await fetch('/api/config');
    
    // Handle non-200 responses
    if (!response.ok) {
      console.warn(`Config API returned ${response.status}, using default config`);
      return DEFAULT_USER_CONFIG;
    }
    
    // Handle empty response
    const text = await response.text();
    if (!text || text.trim() === '') {
      console.warn('Config API returned empty response, using default config');
      return DEFAULT_USER_CONFIG;
    }
    
    // Parse JSON
    const config = JSON.parse(text);
    
    // Decode telemetry key if present
    if (config.telemetryKey) {
      try {
        const decodedTelemetryKey = Buffer.from(
          config.telemetryKey,
          'base64',
        ).toString();
        return { ...config, telemetryKey: decodedTelemetryKey };
      } catch (decodeError) {
        console.warn('Failed to decode telemetry key, using as-is');
        return config;
      }
    }
    
    return { ...DEFAULT_USER_CONFIG, ...config };
  } catch (error) {
    console.warn('Failed to fetch user config, using default:', error.message);
    return DEFAULT_USER_CONFIG;
  }
};
