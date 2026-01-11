// @ts-ignore
import { getSessionCookie } from "better-auth/cookies";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";

const LANGUAGES = ["en", "tr"];
const DEFAULT_LOCALE = "en";
// Removed cookie constant as per user request

function getLocale(request: NextRequest): string {
  // 1. Check Accept-Language header (Browser Lang)
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();

  try {
    return matchLocale(languages, LANGUAGES, DEFAULT_LOCALE);
  } catch (e) {
    return DEFAULT_LOCALE;
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
    return NextResponse.next();
  }

  // --- i18n Check for Content Routes ---
  // Only apply to /blog, /help, and /pricing routes for now, as requested
  const isContentRoute = pathname.startsWith("/blog") || pathname.startsWith("/help") || pathname.startsWith("/pricing");

  // Check if pathname already has locale
  const pathnameHasLocale = LANGUAGES.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    return;
  }

  if (isContentRoute) {
    const locale = getLocale(request);

    // Redirect to locale-prefixed path
    request.nextUrl.pathname = `/${locale}${pathname}`;
    // Preserve query parameters
    request.nextUrl.search = request.nextUrl.search;

    return NextResponse.redirect(request.nextUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Auth matcher
    "/dashboard/:path*",
    // i18n matcher (excluding internal paths)
    "/((?!_next|api|favicon.ico|.*\\.).*)",
  ],
};
