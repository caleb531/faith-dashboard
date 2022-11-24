import { Session } from '@supabase/supabase-js';
import { supabase } from './supabaseClient';

// The number of milliseconds in one second, used for conversions between the
// two units
const MS_IN_S = 1000;

// Return true if the user is signed in with a session that isn't yet expired;
// return false otherwise
export async function isSessionActive(session?: Session | null) {
  if (!session) {
    session = (await supabase.auth.getSession()).data.session;
  }
  const currentEpoch = Date.now() / MS_IN_S;
  return session && session.expires_at && currentEpoch < session.expires_at;
}

// Return true if we are close enough to the expiry of the current session for
// it to be refreshed
export function shouldRefreshSession(session: Session | null) {
  const currentEpoch = Date.now() / MS_IN_S;
  return (
    session &&
    session.expires_at &&
    session.expires_in &&
    currentEpoch > session.expires_at - session.expires_in / 2 &&
    currentEpoch < session.expires_at
  );
}
