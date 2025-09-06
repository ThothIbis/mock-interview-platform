/**
 * Configuration module for environment variables
 * Provides typed access to all environment variables with validation
 */

interface Config {
  // Daily.co
  daily: {
    apiKey: string;
    domain: string;
  };
  
  // Deepgram
  deepgram: {
    apiKey: string;
  };
  
  // Anthropic (Claude)
  anthropic: {
    apiKey: string;
  };
  
  // ElevenLabs
  elevenLabs: {
    apiKey: string;
    voiceId: string;
  };
  
  // Redis
  redis: {
    url: string;
  };
  
  // Application
  app: {
    url: string;
    websocketUrl: string;
    backendUrl: string;
    isDevelopment: boolean;
    isProduction: boolean;
  };
  
  // Interview Settings
  interview: {
    maxDurationSeconds: number;
    maxParticipants: number;
    expiryHours: number;
  };
  
  // Feature Flags
  features: {
    enableRecording: boolean;
    enableAnalytics: boolean;
  };
  
  // Rate Limiting
  rateLimit: {
    requestsPerMinute: number;
  };
}

class ConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConfigurationError';
  }
}

/**
 * Validates that a required environment variable exists
 */
function getRequiredEnv(key: string): string {
  const value = process.env[key];
  if (!value && process.env.NODE_ENV === 'production') {
    throw new ConfigurationError(`Missing required environment variable: ${key}`);
  }
  return value || '';
}

/**
 * Gets an optional environment variable with a default value
 */
function getOptionalEnv(key: string, defaultValue: string): string {
  return process.env[key] || defaultValue;
}

/**
 * Parses a boolean environment variable
 */
function getBooleanEnv(key: string, defaultValue: boolean = false): boolean {
  const value = process.env[key];
  if (!value) return defaultValue;
  return value.toLowerCase() === 'true';
}

/**
 * Parses a number environment variable
 */
function getNumberEnv(key: string, defaultValue: number): number {
  const value = process.env[key];
  if (!value) return defaultValue;
  const parsed = parseInt(value, 10);
  if (isNaN(parsed)) {
    throw new ConfigurationError(`Invalid number for environment variable: ${key}`);
  }
  return parsed;
}

/**
 * Main configuration object
 * Access all environment variables through this typed interface
 */
export const config: Config = {
  daily: {
    apiKey: getRequiredEnv('DAILY_API_KEY'),
    domain: getRequiredEnv('DAILY_DOMAIN'),
  },
  
  deepgram: {
    apiKey: getRequiredEnv('DEEPGRAM_API_KEY'),
  },
  
  anthropic: {
    apiKey: getRequiredEnv('ANTHROPIC_API_KEY'),
  },
  
  elevenLabs: {
    apiKey: getRequiredEnv('ELEVENLABS_API_KEY'),
    voiceId: getOptionalEnv('ELEVENLABS_VOICE_ID', 'EXAVITQu4vr4xnSDxMaL'),
  },
  
  redis: {
    url: getOptionalEnv('REDIS_URL', 'redis://localhost:6379'),
  },
  
  app: {
    url: getOptionalEnv('NEXT_PUBLIC_APP_URL', 'http://localhost:3000'),
    websocketUrl: getOptionalEnv('NEXT_PUBLIC_WEBSOCKET_URL', 'ws://localhost:3001'),
    backendUrl: getOptionalEnv('BACKEND_SERVICE_URL', 'http://localhost:3001'),
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',
  },
  
  interview: {
    maxDurationSeconds: getNumberEnv('MAX_INTERVIEW_DURATION_SECONDS', 900),
    maxParticipants: getNumberEnv('MAX_PARTICIPANTS', 2),
    expiryHours: getNumberEnv('INTERVIEW_EXPIRY_HOURS', 1),
  },
  
  features: {
    enableRecording: getBooleanEnv('ENABLE_RECORDING', false),
    enableAnalytics: getBooleanEnv('ENABLE_ANALYTICS', false),
  },
  
  rateLimit: {
    requestsPerMinute: getNumberEnv('RATE_LIMIT_REQUESTS_PER_MINUTE', 10),
  },
};

/**
 * Client-side safe configuration
 * Only includes NEXT_PUBLIC_ variables that are safe to expose to the browser
 */
export const clientConfig = {
  app: {
    url: getOptionalEnv('NEXT_PUBLIC_APP_URL', 'http://localhost:3000'),
    websocketUrl: getOptionalEnv('NEXT_PUBLIC_WEBSOCKET_URL', 'ws://localhost:3001'),
  },
  daily: {
    domain: getOptionalEnv('NEXT_PUBLIC_DAILY_DOMAIN', ''),
  },
};

/**
 * Validates all required configuration on startup
 * Call this in your app initialization to fail fast on missing config
 */
export function validateConfig(): void {
  const requiredVars = [
    'DAILY_API_KEY',
    'DAILY_DOMAIN',
    'DEEPGRAM_API_KEY',
    'ANTHROPIC_API_KEY',
    'ELEVENLABS_API_KEY',
  ];
  
  const missing: string[] = [];
  
  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  }
  
  if (missing.length > 0 && process.env.NODE_ENV === 'production') {
    throw new ConfigurationError(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please check your .env.local file or Vercel environment settings.'
    );
  }
  
  if (missing.length > 0 && process.env.NODE_ENV === 'development') {
    console.warn(
      '⚠️  Missing environment variables detected:\n' +
      missing.map(v => `   - ${v}`).join('\n') + '\n' +
      'The app may not function correctly. Check your .env.local file.'
    );
  }
}

/**
 * Type-safe environment variable access
 * Use this to ensure you're accessing the right config values
 */
export type ConfigType = typeof config;
export type ClientConfigType = typeof clientConfig;

export default config;