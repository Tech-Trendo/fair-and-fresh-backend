import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static files with extensions (like .jpg, .png, .css, etc.)
  if (pathname.includes('.')) {
    return NextResponse.next();
  }

  const response = NextResponse.next();

  try {
    // Call the internal API endpoint to fetch robots configuration for this path
    const apiUrl = new URL(`/api/robots-tag?path=${encodeURIComponent(pathname)}`, request.url);
    const res = await fetch(apiUrl);
    if (res.ok) {
      const data = await res.json();
      if (data.metaRobots) {
        response.headers.set('X-Robots-Tag', data.metaRobots);
      }
    }
  } catch (err) {
    console.error('Failed to set X-Robots-Tag in proxy:', err);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - uploads (uploaded files)
     * - dashboard (admin dashboard pages)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|uploads|dashboard).*)',
  ],
};
