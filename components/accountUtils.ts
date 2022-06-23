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
  const currentEpoch = Date.now() / MS_IN_S;
  return session && session.expires_at && currentEpoch < session.expires_at;
}

// Return true if we are close enough to the expiry of the current session for
// it to be refreshed
export function shouldRefreshSession(
  session: Session | null = supabase.auth.session()
) {
  const currentEpoch = Date.now() / MS_IN_S;
  return (
    session &&
    session.expires_at &&
    session.expires_in &&
    currentEpoch > session.expires_at - session.expires_in / 2 &&
    currentEpoch < session.expires_at
  );
}

export async function refreshSession(
  session: Session | null = supabase.auth.session()
) {
  if (session) {
    await supabase.auth.signIn({
      refreshToken: session.refresh_token
    });
  }
}