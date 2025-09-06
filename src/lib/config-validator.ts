/**
 * Configuration validation utilities
 * Run these checks at build time and runtime to ensure proper configuration
 */

import { config, validateConfig } from './config';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Comprehensive configuration validation
 * Checks for required values, format validity, and logical consistency
 */
export function validateConfiguration(): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Check Daily.co configuration
  if (!config.daily.apiKey || config.daily.apiKey.includes('placeholder')) {
    errors.push('Daily.co API key is not configured');
  }
  
  if (!config.daily.domain || config.daily.domain.includes('placeholder')) {
    errors.push('Daily.co domain is not configured');
  }
  
  // Check Deepgram configuration
  if (!config.deepgram.apiKey || config.deepgram.apiKey.includes('placeholder')) {
    errors.push('Deepgram API key is not configured');
  }
  
  // Check Anthropic configuration
  if (!config.anthropic.apiKey || config.anthropic.apiKey.includes('placeholder')) {
    errors.push('Anthropic API key is not configured');
  }
  
  // Check ElevenLabs configuration
  if (!config.elevenLabs.apiKey || config.elevenLabs.apiKey.includes('placeholder')) {
    errors.push('ElevenLabs API key is not configured');
  }
  
  if (!config.elevenLabs.voiceId) {
    warnings.push('ElevenLabs voice ID is not configured, using default');
  }
  
  // Check Redis configuration (warning only, as it's for future use)
  if (!config.redis.url || config.redis.url === 'redis://localhost:6379') {
    warnings.push('Redis URL is using default localhost, configure for production');
  }
  
  // Check application URLs
  if (config.app.isProduction && config.app.url.includes('localhost')) {
    errors.push('Application URL should not use localhost in production');
  }
  
  if (config.app.isProduction && config.app.websocketUrl.includes('localhost')) {
    warnings.push('WebSocket URL should not use localhost in production');
  }
  
  // Check interview settings
  if (config.interview.maxDurationSeconds < 60) {
    errors.push('Interview duration must be at least 60 seconds');
  }
  
  if (config.interview.maxDurationSeconds > 3600) {
    warnings.push('Interview duration is over 1 hour, this may increase costs');
  }
  
  if (config.interview.maxParticipants < 2) {
    errors.push('Interview must allow at least 2 participants');
  }
  
  // Check rate limiting
  if (config.rateLimit.requestsPerMinute < 1) {
    errors.push('Rate limit must allow at least 1 request per minute');
  }
  
  if (config.rateLimit.requestsPerMinute > 100) {
    warnings.push('Rate limit is very high, consider reducing for cost control');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Logs configuration status to console with formatting
 */
export function logConfigurationStatus(): void {
  const result = validateConfiguration();
  
  console.log('\n📋 Configuration Status\n' + '='.repeat(50));
  
  if (result.isValid) {
    console.log('✅ Configuration is valid');
  } else {
    console.log('❌ Configuration has errors');
  }
  
  if (result.errors.length > 0) {
    console.log('\n🚨 Errors:');
    result.errors.forEach(error => console.log(`   • ${error}`));
  }
  
  if (result.warnings.length > 0) {
    console.log('\n⚠️  Warnings:');
    result.warnings.forEach(warning => console.log(`   • ${warning}`));
  }
  
  console.log('\n' + '='.repeat(50) + '\n');
}

/**
 * Checks if the application can run with current configuration
 * In development, allows placeholder values with warnings
 * In production, requires all values to be properly set
 */
export function canRunApplication(): boolean {
  const result = validateConfiguration();
  
  if (config.app.isDevelopment) {
    // In development, we can run with warnings
    if (!result.isValid) {
      console.warn(
        '⚠️  Running in development mode with configuration errors.\n' +
        'Some features may not work properly.'
      );
    }
    return true;
  }
  
  // In production, we need valid configuration
  return result.isValid;
}

/**
 * Safe configuration check for client-side
 * Returns only non-sensitive validation results
 */
export function getClientConfigStatus() {
  return {
    hasValidDailyDomain: !!process.env.NEXT_PUBLIC_DAILY_DOMAIN && 
                         !process.env.NEXT_PUBLIC_DAILY_DOMAIN.includes('placeholder'),
    hasValidAppUrl: !!process.env.NEXT_PUBLIC_APP_URL,
    hasValidWebsocketUrl: !!process.env.NEXT_PUBLIC_WEBSOCKET_URL,
    isDevelopment: process.env.NODE_ENV === 'development',
  };
}