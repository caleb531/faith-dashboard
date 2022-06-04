import { Session } from '@supabase/supabase-js';
import { supabase } from './supabaseClient';

// The number of milliseconds in one second, used for conversions between the
// two units
const MS_IN_S = 1000;

// Return true if the user is signed in with a session that isn't yet expired;
// return false otherwise
export function isSessionActive(
  session: Session | null = supabase.auth.session()
) {
  return (
    session
    &&
    session.expires_at
    &&
    (Date.now() / MS_IN_S) < session.expires_at
  );
}
