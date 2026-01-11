// @ts-ignore
import { getSessionCookie } from "better-auth/cookies";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import {
  DEFAULT_LANGUAGE,
  LANGUAGE_COOKIE_NAME,
  LANGUAGE_HEADER_NAME,
  SUPPORTED_LANGUAGES,
} from "@/lib/i18n-constants";

function getLocale(request: NextRequest): string {
  // Check Accept-Language header (Browser Lang)
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();

  try {
    return matchLocale(languages, [...SUPPORTED_LANGUAGES], DEFAULT_LANGUAGE);
  } catch (e) {
    return DEFAULT_LANGUAGE;
  }
}

/**
 * Next.js Proxy (formerly Middleware).
 *
 * Important: keep this as an *optimistic* check only.
 * We only check for presence of Better Auth session cookie and redirect if absent.
 */
export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // --- Determine locale for all routes ---
  // Check if pathname already has locale prefix
  const pathnameHasLocale = SUPPORTED_LANGUAGES.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // Get locale from URL path, cookie, or Accept-Language header
  let locale: string;
  if (pathnameHasLocale) {
    locale = pathname.split("/")[1];
  } else {
    // Check cookie first
    const cookieLocale = request.cookies.get(LANGUAGE_COOKIE_NAME)?.value;
    if (cookieLocale && SUPPORTED_LANGUAGES.includes(cookieLocale as typeof SUPPORTED_LANGUAGES[number])) {
      locale = cookieLocale;
    } else {
      locale = getLocale(request);
    }
  }

  // --- Auth Check for Dashboard ---
  if (pathname.startsWith("/dashboard")) {
    // Optimistic cookie-only check (NOT full validation).
    // This is the recommended approach for Next.js Proxy to avoid blocking requests.
    const sessionCookie = getSessionCookie(request);

    if (!sessionCookie) {
      const url = request.nextUrl.clone();
      url.pathname = "/sign-in";
      // Keep it simple; the sign-in page can decide whether to use this param.
      url.searchParams.set("redirect", request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }
    // Inject language header for dashboard routes
    const response = NextResponse.next();
    response.headers.set(LANGUAGE_HEADER_NAME, locale);
    return response;
  }

  // --- i18n Check for Content Routes ---
  // Only apply URL prefix to /blog, /help, and /pricing routes
  const isContentRoute = pathname.startsWith("/blog") || pathname.startsWith("/help") || pathname.startsWith("/pricing");

  if (pathnameHasLocale) {
    // Already has locale, just inject header
    const response = NextResponse.next();
    response.headers.set(LANGUAGE_HEADER_NAME, locale);
    return response;
  }

  if (isContentRoute) {
    // Redirect to locale-prefixed path
    request.nextUrl.pathname = `/${locale}${pathname}`;
    // Preserve query parameters
    request.nextUrl.search = request.nextUrl.search;

    return NextResponse.redirect(request.nextUrl);
  }

  // For all other routes, inject language header
  const response = NextResponse.next();
  response.headers.set(LANGUAGE_HEADER_NAME, locale);
  return response;
}

export const config = {
  matcher: [
    // Auth matcher
    "/dashboard/:path*",
    // i18n matcher (excluding internal paths)
    "/((?!_next|api|favicon.ico|.*\\.).*)",
  ],
};
