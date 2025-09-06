/**
 * React hook for accessing configuration in client components
 * Only exposes client-safe configuration values
 */

import { useEffect, useState } from 'react';
import { clientConfig, type ClientConfigType } from '../config';
import { getClientConfigStatus } from '../config-validator';

interface ConfigHookReturn {
  config: ClientConfigType;
  status: ReturnType<typeof getClientConfigStatus>;
  isReady: boolean;
  hasErrors: boolean;
}

/**
 * Hook to access client-side configuration
 * Provides reactive access to configuration with validation status
 */
export function useConfig(): ConfigHookReturn {
  const [configState, setConfigState] = useState<ConfigHookReturn>(() => {
    const status = getClientConfigStatus();
    return {
      config: clientConfig,
      status,
      isReady: status.hasValidAppUrl && (status.isDevelopment || status.hasValidDailyDomain),
      hasErrors: !status.hasValidAppUrl,
    };
  });

  useEffect(() => {
    // Re-evaluate config status on mount
    const status = getClientConfigStatus();
    const isReady = status.hasValidAppUrl && (status.isDevelopment || status.hasValidDailyDomain);
    const hasErrors = !status.hasValidAppUrl;

    setConfigState({
      config: clientConfig,
      status,
      isReady,
      hasErrors,
    });

    // Log configuration status in development
    if (status.isDevelopment) {
      console.log('🔧 Client Configuration Status:', {
        appUrl: status.hasValidAppUrl ? '✅' : '❌',
        dailyDomain: status.hasValidDailyDomain ? '✅' : '⚠️',
        websocketUrl: status.hasValidWebsocketUrl ? '✅' : '⚠️',
        isReady: isReady ? '✅' : '❌',
      });
    }
  }, []);

  return configState;
}

/**
 * Hook to check if a specific service is configured
 */
export function useServiceConfig(service: 'daily' | 'websocket') {
  const { config, status } = useConfig();
  
  switch (service) {
    case 'daily':
      return {
        isConfigured: status.hasValidDailyDomain,
        config: config.daily,
      };
    case 'websocket':
      return {
        isConfigured: status.hasValidWebsocketUrl,
        config: { url: config.app.websocketUrl },
      };
    default:
      return {
        isConfigured: false,
        config: null,
      };
  }
}