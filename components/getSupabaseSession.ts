import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// The getSupabaseSessionInfo() utility returns info related to the
// authenticated session and user
async function getSupabaseSession() {
  const supabase = createServerComponentClient({ cookies });
  const sessionResponse = await supabase.auth.getSession();
  return sessionResponse.data.session;
}
export default getSupabaseSession;
