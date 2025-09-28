import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Set tracesSampleRate to 1.0 to capture 100% of the transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // ...

  // Note: if you want to override the automatic release value, do not set a
  // `release` value here - use the environment variable `SENTRY_RELEASE`, so
  // that it will also get attached to your source maps

  beforeSend(event, hint) {
    // Filter out known non-critical errors
    const error = hint.originalException;

    // Filter out Firebase connection errors in development
    if (process.env.NODE_ENV === 'development' && error && error instanceof Error) {
      if (error.message.includes('Firebase') ||
          error.message.includes('Firestore') ||
          error.message.includes('auth/')) {
        return null;
      }
    }

    return event;
  },

  // Define custom tags for better error categorization
  initialScope: {
    tags: {
      component: 'server',
      environment: process.env.NODE_ENV,
    },
  },
});