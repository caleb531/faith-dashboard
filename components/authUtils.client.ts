import { createBrowserClient } from '@supabase/ssr';
import { Session, User } from '@supabase/supabase-js';
import { Database } from './database.types';

export const supabase = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// The number of milliseconds in one second, used for conversions between the
// two units
const MS_IN_S = 1000;

// Return the actual supabase Session object associated with this session
export async function getSession(): Promise<Session | null> {
  await supabase.auth.getUser();
  return (await supabase.auth.getSession())?.data?.session || null;
}

export async function getUser(): Promise<User | null> {
  return (await supabase.auth.getUser())?.data?.user || null;
}

// Return true if the user is signed in with a session that isn't yet expired;
// return false otherwise
export function isSessionActive(session: Session | null): boolean {
  const currentEpoch = Date.now() / MS_IN_S;
  return Boolean(
    session && session.expires_at && currentEpoch < session.expires_at
  );
}

// See
// <https://stackoverflow.com/questions/47632622/typescript-and-filter-boolean>
export function isTruthy<T>(value: T | null | undefined | false): value is T {
  return Boolean(value);
}

// Convert the given object of key-value pairs to a FormData object; this is
// useful for serializing an object into a format that can be POST'ed to the
// server with the Fetch API
export function convertObjectToFormData(fields: object) {
  const formData = new FormData();
  Object.entries(fields).forEach(([key, value]) => {
    formData.append(key, String(value));
  });
  return formData;
}
