import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
  localeDetection: false,
});

export const config = {
  // Match only internationalized pathnames
  matcher: [
    '/', // Redirects the root to a locale
    '/(en|es)/:path*', // Applies middleware to prefixed paths
    // Explicitly exclude paths that should not be internationalized.
    // This prevents the middleware from running on API routes, static files, etc.
    '/((?!api|_next/static|_next/image|favicon.ico).*)'
  ]
};