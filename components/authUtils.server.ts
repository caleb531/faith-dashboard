import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies, headers } from 'next/headers';

// The getSession() utility returns info related to the
// authenticated session and user
export async function getSession() {
  // This fixes a "Dynamic server usage: cookies" error. See:
  // <https://github.com/vercel/next.js/issues/49373#issuecomment-1662263802>
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });
  const sessionResponse = await supabase.auth.getSession();
  return sessionResponse.data.session;
}

// The getUser() utility returns info related to the authenticated user (but
// with more fields than what getSession().user provides, like details of a
// pending email change)
export async function getUser() {
  // This fixes a "Dynamic server usage: cookies" error.
  // See:
  // <https://github.com/vercel/next.js/issues/49373#issuecomment-1662263802>
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });
  const sessionResponse = await supabase.auth.getUser();
  return sessionResponse.data.user;
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
