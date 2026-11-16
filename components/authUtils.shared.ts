import type { Session, User } from '@supabase/supabase-js';

// The milliseconds to wait for authentication before rendering the page
export const AUTH_TIMEOUT_MS = 1000;

// The milliseconds allowed for recovery after the page has already loaded
export const AUTH_RECOVERY_TIMEOUT_MS = 10000;

// The milliseconds to wait before retrying unavailable authentication
export const AUTH_RETRY_DELAY_MS = 30000;

// The retries allowed after the initial background authentication request
export const AUTH_MAX_RETRIES = 2;

// Authentication results distinguish an outage from a missing login
export type AuthResult =
  | {
      status: 'authenticated';
      user: User;
      session: Session;
    }
  | {
      status: 'anonymous' | 'unavailable';
      user: null;
      session: null;
    };

// Stop waiting for auth at the deadline, even during the SDK's retry backoff
export async function withAuthTimeout<T>(
  operation: (signal: AbortSignal) => Promise<T>,
  timeoutMs = AUTH_TIMEOUT_MS
): Promise<T | null> {
  // Cancel in-flight requests and reject later attempts after the deadline
  const controller = new AbortController();
  // The timer is cleared when authentication finishes before its deadline
  let timer: ReturnType<typeof setTimeout> | undefined;
  // Return control to rendering even if the SDK continues its internal retries
  const timeout = new Promise<null>((resolve) => {
    timer = setTimeout(() => {
      controller.abort();
      resolve(null);
    }, timeoutMs);
  });

  try {
    return await Promise.race([operation(controller.signal), timeout]);
  } finally {
    clearTimeout(timer);
  }
}
