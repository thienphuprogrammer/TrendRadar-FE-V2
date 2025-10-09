import type { NextApiRequest, NextApiResponse } from 'next';
import { getConfig } from '@/apollo/server/config';

export default function handler(_: NextApiRequest, res: NextApiResponse) {
  try {
    const config = getConfig();
    
    // Safely encode telemetry key
    let encodedTelemetryKey = '';
    try {
      encodedTelemetryKey = config.posthogApiKey
        ? Buffer.from(config.posthogApiKey).toString('base64')
        : '';
    } catch (encodeError) {
      console.error('Failed to encode telemetry key:', encodeError);
    }

    // Return config with fallback values
    res.status(200).json({
      isTelemetryEnabled: config.telemetryEnabled || false,
      telemetryKey: encodedTelemetryKey,
      telemetryHost: config.posthogHost || '',
      userUUID: config.userUUID || 'default-user',
    });
  } catch (error) {
    console.error('Error in config API:', error);
    
    // Return default config on error instead of 500
    res.status(200).json({
      isTelemetryEnabled: false,
      telemetryKey: '',
      telemetryHost: '',
      userUUID: 'default-user',
    });
  }
}
