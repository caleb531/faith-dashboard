import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';

import type { NextRequest } from 'next/server';

// In order to avoid the use of 'unsafe-inline' for script-src, we must generate
// our Content-Security-Policy in the middleware and define a random nonce that
// will be read by NextJS and applied to all of its <script> tags (sources:
// <https://stackoverflow.com/questions/76353091/how-to-add-nonce-to-inline-styles-and-scripts-in-next-js>
// and
// <https://stackoverflow.com/questions/76270173/can-a-nonce-be-used-for-multiple-scripts-or-not>)
function generateCSP() {
  const nonce = crypto.randomUUID();
  return [
    `default-src 'none';`,
    ` style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://hcaptcha.com https://*.hcaptcha.com;`,
    ` font-src 'self' https://fonts.gstatic.com data:;`,
    ` img-src * data:;`,
    ` script-src 'self' 'nonce-${nonce}' https://storage.googleapis.com ${process.env.NEXT_PUBLIC_ANALYTICS_SITE_ID ? 'https://gc.zgo.at' : ''} https://challenges.cloudflare.com;`,
    ` frame-src 'self' https://challenges.cloudflare.com;`,
    ` child-src 'self' https://challenges.cloudflare.com;`,
    ` connect-src *;`,
    ` manifest-src 'self';`,
    ` media-src *;`
  ].join(' ');
}

// Source:
// <https://stackoverflow.com/a/76567353/560642>
// function getResponseWithCSPApplied(req: NextRequest) {
//   ... This function is now inlined/adapted in middleware
// }

export default async function proxy(request: NextRequest) {
  const csp = generateCSP();
  const requestHeaders = new Headers(request.headers);

  // Apply CSP to request headers, but only in Production
  if (process.env.NODE_ENV === 'production') {
    requestHeaders.set('content-security-policy', csp);
  }

  let response = NextResponse.next({
    request: {
      headers: requestHeaders
    }
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request: {
              headers: requestHeaders
            }
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        }
      }
    }
  );

  // Ensure that the user's session stays active
  await supabase.auth.getUser();

  // Set the request URL in the headers so it can be accessed from a Server
  // Component (source: <https://stackoverflow.com/a/75363135/560642>)
  response.headers.set('x-url', request.url);

  if (process.env.NODE_ENV === 'production') {
    response.headers.set('content-security-policy', csp);
  }

  return response;
}
