import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Session, User } from '@supabase/supabase-js';

const supabase = createClientComponentClient();

// The number of milliseconds in one second, used for conversions between the
// two units
const MS_IN_S = 1000;

// Return the actual supabase Session object associated with this session
export async function getSession(): Promise<Session | null> {
  return (await supabase.auth.getSession())?.data?.session || null;
}

export async function getUser(): Promise<User | null> {
  return (await supabase.auth.getUser())?.data?.user || null;
}

// Return true if the user is signed in with a session that isn't yet expired;
// return false otherwise
export async function isSessionActive(
  session?: Session | null
): Promise<boolean> {
  if (!session) {
    session = await getSession();
  }
  const currentEpoch = Date.now() / MS_IN_S;
  return Boolean(
    session && session.expires_at && currentEpoch < session.expires_at
  );
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

// See
// <https://stackoverflow.com/questions/47632622/typescript-and-filter-boolean>
export function isTruthy<T>(value: T | null | undefined | false): value is T {
  return Boolean(value);
}
