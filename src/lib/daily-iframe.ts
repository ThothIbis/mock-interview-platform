/**
 * Daily.co iframe integration utilities
 * Helper functions for embedding Daily.co video in custom layouts
 */

export interface DailyIframeProps {
  roomUrl: string;
  width?: number;
  height?: number;
  styling?: {
    border?: string;
    borderRadius?: string;
  };
}

/**
 * Generate Daily.co iframe URL with custom configuration
 */
export function getDailyIframeUrl(roomUrl: string): string {
  const url = new URL(roomUrl);
  
  // Add customization parameters
  url.searchParams.set('t', Date.now().toString()); // Cache bust
  url.searchParams.set('embed', 'true');
  
  return url.toString();
}

/**
 * Create iframe element for Daily.co room
 */
export function createDailyIframe(props: DailyIframeProps): HTMLIFrameElement {
  const iframe = document.createElement('iframe');
  
  iframe.src = getDailyIframeUrl(props.roomUrl);
  iframe.width = props.width?.toString() || '100%';
  iframe.height = props.height?.toString() || '100%';
  iframe.style.border = props.styling?.border || 'none';
  iframe.style.borderRadius = props.styling?.borderRadius || '0';
  iframe.allow = 'camera; microphone; fullscreen; display-capture';
  iframe.allowFullscreen = true;
  
  return iframe;
}