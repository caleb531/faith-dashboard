import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies, headers } from 'next/headers';

// The getSession() utility returns info related to the
// authenticated session and user
export async function getSession() {
  const supabase = createServerComponentClient({ cookies });
  const sessionResponse = await supabase.auth.getSession();
  return sessionResponse.data.session;
}

// The getUser() utility returns info related to the authenticated user (but
// with more fields than what getSession().user provides, like details of a
// pending email change)
export async function getUser() {
  const supabase = createServerComponentClient({ cookies });
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
