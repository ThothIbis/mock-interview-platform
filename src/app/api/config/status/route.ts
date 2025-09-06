/**
 * API endpoint to check configuration status
 * Returns non-sensitive configuration information
 */

import { NextResponse } from 'next/server';
import { validateConfiguration, canRunApplication } from '@/lib/config-validator';
import { config } from '@/lib/config';

export async function GET() {
  try {
    const validation = validateConfiguration();
    const canRun = canRunApplication();
    
    // Return only non-sensitive configuration status
    return NextResponse.json({
      status: validation.isValid ? 'valid' : 'invalid',
      canRun,
      environment: config.app.isDevelopment ? 'development' : 'production',
      services: {
        daily: {
          configured: !!config.daily.apiKey && !config.daily.apiKey.includes('placeholder'),
          domain: !!config.daily.domain && !config.daily.domain.includes('placeholder'),
        },
        deepgram: {
          configured: !!config.deepgram.apiKey && !config.deepgram.apiKey.includes('placeholder'),
        },
        anthropic: {
          configured: !!config.anthropic.apiKey && !config.anthropic.apiKey.includes('placeholder'),
        },
        elevenLabs: {
          configured: !!config.elevenLabs.apiKey && !config.elevenLabs.apiKey.includes('placeholder'),
        },
      },
      interview: {
        maxDurationSeconds: config.interview.maxDurationSeconds,
        maxParticipants: config.interview.maxParticipants,
        expiryHours: config.interview.expiryHours,
      },
      features: config.features,
      validation: {
        errors: validation.errors.length,
        warnings: validation.warnings.length,
        // In development, include actual messages for debugging
        ...(config.app.isDevelopment && {
          errorMessages: validation.errors,
          warningMessages: validation.warnings,
        }),
      },
    });
  } catch (error) {
    console.error('Configuration status check failed:', error);
    
    return NextResponse.json({
      status: 'error',
      canRun: false,
      error: 'Configuration validation failed',
    }, { status: 500 });
  }
}