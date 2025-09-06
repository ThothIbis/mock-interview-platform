/**
 * Configuration initialization
 * Import this to validate config on app startup
 */

import { logConfigurationStatus, canRunApplication } from '@/lib/config-validator';

// Run configuration validation on import
if (typeof window === 'undefined') {
  // Server-side only
  logConfigurationStatus();
  
  if (!canRunApplication()) {
    console.error('❌ Application cannot run with current configuration');
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
}

// Export a no-op function to ensure this module is imported for its side effects
export function initializeConfig() {
  // This function intentionally does nothing
  // It's just to ensure the module is imported and side effects run
}