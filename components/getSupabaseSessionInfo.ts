import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// The getSupabaseSessionInfo() utility returns info related to the
// authenticated session and user
async function getSupabaseSessionInfo() {
  const supabase = createServerComponentClient({ cookies });
  return {
    session: await supabase.auth.getSession(),
    user: await supabase.auth.getUser()
  };
}
export default getSupabaseSessionInfo;
