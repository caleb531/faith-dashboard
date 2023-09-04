import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';

import type { NextRequest } from 'next/server';
import type { Database } from './components/database.types';

// In order to avoid the use of 'unsafe-inline' for script-src, we must generate
// our Content-Security-Policy in the middleware and define a random nonce that
// will be read by NextJS and applied to all of its <script> tags (sources:
// <https://stackoverflow.com/questions/76353091/how-to-add-nonce-to-inline-styles-and-scripts-in-next-js>
// and
// <https://stackoverflow.com/questions/76270173/can-a-nonce-be-used-for-multiple-scripts-or-not>)
function generateCSP() {
  const nonce = crypto.randomUUID();
  return `default-src 'none'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://hcaptcha.com https://*.hcaptcha.com; font-src 'self' https://fonts.gstatic.com data:; img-src * data:; script-src 'self' 'nonce-${nonce}' https://storage.googleapis.com https://plausible.io https://challenges.cloudflare.com; frame-src 'self' https://challenges.cloudflare.com; child-src 'self' https://challenges.cloudflare.com; connect-src *; manifest-src 'self'; media-src *;`;
}

// Source:
// <https://stackoverflow.com/a/76567353/560642>
function getResponseWithCSPApplied(req: NextRequest) {
  const csp = generateCSP();
  // Clone the request headers
  const requestHeaders = new Headers(req.headers);
  // Set the CSP header so that Next.js can read it and generate tags with the
  // nonce
  requestHeaders.set('content-security-policy', csp);
  // Create new response
  const res = NextResponse.next({
    request: {
      // New request headers
      headers: requestHeaders
    }
  });
  // Also set the CSP header in the response so that it is outputted to the
  // browser
  res.headers.set('content-security-policy', csp);
  return res;
}

export async function middleware(req: NextRequest) {
  // Apply CSP to response, but only in Production
  const res =
    process.env.NODE_ENV === 'production'
      ? getResponseWithCSPApplied(req)
      : NextResponse.next();
  // Ensure that the user's session remains active by refreshing the user's
  // session before loading a Server Component route (source:
  // <https://supabase.com/docs/guides/auth/auth-helpers/nextjs#managing-session-with-middleware>)
  const supabase = createMiddlewareClient<Database>({ req, res });
  await supabase.auth.getSession();
  // Set the request URL in the headers so it can be accessed from a Server
  // Component (source: <https://stackoverflow.com/a/75363135/560642>)
  res.headers.set('x-url', req.url);
  return res;
}
