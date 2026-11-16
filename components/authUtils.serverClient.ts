// Share Supabase client configuration between the proxy and server helpers
// Each caller supplies its cookie adapter because the proxy uses NextRequest,
// while authUtils.server uses next/headers; keep request-specific APIs there
// "Client" here means a Supabase API client running on the server
import { createServerClient, type CookieMethodsServer } from '@supabase/ssr';

// Build a server client with shared cancellation and cookie-write handling
export function createSupabaseServerClient<T>(
  cookies: CookieMethodsServer,
  signal?: AbortSignal
) {
  return createServerClient<T>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        // Preserve caller cancellation and stop requests after auth times out
        fetch(input, init) {
          signal?.throwIfAborted();
          return fetch(input, {
            ...init,
            signal: signal
              ? init?.signal
                ? AbortSignal.any([signal, init.signal])
                : signal
              : init?.signal
          });
        }
      },
      cookies: {
        ...cookies,
        // Ignore SDK writes after the response has stopped waiting for auth
        setAll(cookiesToSet, headersToSet) {
          if (!signal?.aborted) {
            return cookies.setAll?.(cookiesToSet, headersToSet);
          }
        }
      }
    }
  );
}
