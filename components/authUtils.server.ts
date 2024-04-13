import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies, headers } from 'next/headers';

export function getSupabaseServerClient<T>() {
  const cookieStore = cookies();
  return createServerClient<T>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: '', ...options });
        }
      }
    }
  );
}

// The getSession() utility returns info related to the
// authenticated session and user
export async function getSession() {
  // This fixes a "Dynamic server usage: cookies" error. See:
  // <https://github.com/vercel/next.js/issues/49373#issuecomment-1662263802>
  const cookieStore = cookies();
  const supabase = getSupabaseServerClient();
  await supabase.auth.getUser();
  const sessionResponse = await supabase.auth.getSession();
  return sessionResponse.data.session;
}

// The getUser() utility returns info related to the authenticated user (but
// with more fields than what getSession().user provides, like details of a
// pending email change)
export async function getUser() {
  const supabase = getSupabaseServerClient();
  const userResponse = await supabase.auth.getUser();
  return userResponse.data.user;
}

// Retrieve a link to the Sign In page that will redirect to the current page on
// successful authentication
export function getSignInUrlForCurrentPage() {
  const url = headers().get('x-url') || '';
  if (url) {
    return `/sign-in?redirect_to=${encodeURIComponent(new URL(url).pathname)}`;
  } else {
    return '/sign-in';
  }
}
