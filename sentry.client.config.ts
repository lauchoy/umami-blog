import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Set tracesSampleRate to 1.0 to capture 100% of the transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Capture Replay for 10% of all sessions,
  // plus for 100% of sessions with an error
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  // ...

  // Note: if you want to override the automatic release value, do not set a
  // `release` value here - use the environment variable `SENTRY_RELEASE`, so
  // that it will also get attached to your source maps

  beforeSend(event, hint) {
    // Filter out known non-critical errors
    const error = hint.originalException;

    // Filter out network errors that might be temporary
    if (error && error instanceof Error) {
      if (error.message.includes('NetworkError') ||
          error.message.includes('fetch')) {
        return null;
      }
    }

    return event;
  },

  integrations: [
    Sentry.replayIntegration({
      // Mask all text and input content
      maskAllText: true,
      blockAllMedia: true,
    }),
    // Add performance monitoring for React components
    Sentry.reactRouterV6BrowserTracingIntegration({
      useEffect: React.useEffect,
      useLocation: () => ({ pathname: window.location.pathname }),
      useNavigationType: () => 'POP',
      createRoutesFromChildren: () => [],
      matchRoutes: () => null,
    }),
  ],

  // Define custom tags for better error categorization
  initialScope: {
    tags: {
      component: 'client',
      environment: process.env.NODE_ENV,
    },
  },
});

// Import React for the integration
import React from 'react';