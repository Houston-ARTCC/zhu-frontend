import * as Sentry from '@sentry/nextjs';
import '@/lib/zod';

Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    enabled: process.env.NODE_ENV === 'production',
    tracesSampleRate: 1.0,
});

// Not sure why this is throwing a fit, but it works fine
// eslint-disable-next-line import/namespace
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
