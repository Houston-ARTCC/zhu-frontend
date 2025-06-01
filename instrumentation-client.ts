import * as Sentry from '@sentry/nextjs';

Sentry.init({
    dsn: process.env.SENTRY_DSN,
    enabled: process.env.NODE_ENV === 'production',
    sendDefaultPii: true,
    tracesSampleRate: 1.0,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
