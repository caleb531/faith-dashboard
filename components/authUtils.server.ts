import { isAuthSessionMissingError } from '@supabase/supabase-js';
import { cookies, headers } from 'next/headers';
import { createSupabaseServerClient } from './authUtils.serverClient';
import {
  AUTH_TIMEOUT_MS,
  type AuthResult,
  withAuthTimeout
} from './authUtils.shared';

// Read and write the current request's cookies through the shared server client
export async function getSupabaseServerClient<T>(signal?: AbortSignal) {
  // The cookie store is writable in Route Handlers, but not Server Components
  const cookieStore = await cookies();
  return createSupabaseServerClient<T>(
    {
      // Read all chunks of the session cookie
      getAll() {
        return cookieStore.getAll();
      },
      // Middleware persists refreshed cookies when a Server Component can't
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Next.js doesn't allow cookie writes inside Server Components
        }
      }
    },
    signal
  );
}

// Verify identity before reading the session; keep outages distinct from logout
export async function getAuth(
  timeoutMs = AUTH_TIMEOUT_MS
): Promise<AuthResult> {
  // A failed verification must never expose an unverified cookie's user data
  const result = await withAuthTimeout(async (signal): Promise<AuthResult> => {
    // Share the client so the session reflects the completed verification
    const supabase = await getSupabaseServerClient(signal);
    // The user record is fetched from Auth rather than trusted from cookies
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      // Rejected credentials require login; service failures can retry
      const isAnonymous =
        isAuthSessionMissingError(error) ||
        error.status === 400 ||
        error.status === 401 ||
        error.status === 403;
      return {
        status: isAnonymous ? 'anonymous' : 'unavailable',
        user: null,
        session: null
      };
    }
    if (!data.user) {
      return { status: 'anonymous', user: null, session: null };
    }
    // Retrieve tokens only after successful user verification on this client
    const sessionResponse = await supabase.auth.getSession();
    if (sessionResponse.error) {
      return { status: 'unavailable', user: null, session: null };
    }
    if (!sessionResponse.data.session) {
      return { status: 'anonymous', user: null, session: null };
    }
    return {
      status: 'authenticated',
      user: data.user,
      session: sessionResponse.data.session
    };
  }, timeoutMs);
  return result ?? { status: 'unavailable', user: null, session: null };
}

// Retrieve a link to the Sign In page that will redirect to the current page on
// successful authentication
export async function getSignInUrlForCurrentPage() {
  const headersList = await headers();
  const url = headersList.get('x-url') || '';
  if (url) {
    return `/sign-in?redirect_to=${encodeURIComponent(new URL(url).pathname)}`;
  } else {
    return '/sign-in';
  }
}
