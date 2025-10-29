import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { fallbackLng, languages } from './app/i18n/settings';

const PUBLIC_FILE = /\.(.*)$/;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('/static') ||
    PUBLIC_FILE.test(pathname)
  ) {
    return;
  }

  const lng = languages.find((locale) => pathname.startsWith(`/${locale}`));

  if (!lng) {
    const locale = request.cookies.get('NEXT_LOCALE')?.value || fallbackLng;
    return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url));
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};
