import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// X-Robots-Tag is only consumed by crawlers, not by real visitors. Gating the
// robots lookup to known bot user-agents removes the internal /api/robots-tag
// round-trip (600ms-2.9s per request) from every normal page load entirely.
const CRAWLER_AGENTS = [
  'googlebot',
  'bingbot',
  'msnbot',
  'bingpreview',
  'slurp',
  'duckduckbot',
  'baiduspider',
  'yandexbot',
  'seznambot',
  'sogou',
  'ia_archiver',
  'facebookexternalhit',
  'twitterbot',
  'applebot',
  'ahrefsbot',
  'semrushbot',
  'mj12bot',
  'rogerbot',
  'majestic',
  'exabot',
  'petalbot',
  'bytespider',
  'amazonbot',
  'gptbot',
  'ccbot',
  'dotbot',
  'uptimerobot',
];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static files with extensions (like .jpg, .png, .css, etc.)
  if (pathname.includes('.')) {
    return NextResponse.next();
  }

  const userAgent = (request.headers.get('user-agent') || '').toLowerCase();
  if (!CRAWLER_AGENTS.some((agent) => userAgent.includes(agent))) {
    return NextResponse.next();
  }

  const response = NextResponse.next();

  try {
    // Only reached for crawler requests — call the internal API endpoint to
    // fetch robots configuration for this path.
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
