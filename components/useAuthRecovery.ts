import { useEffect, useState } from 'react';
import {
  AUTH_MAX_RETRIES,
  AUTH_RECOVERY_TIMEOUT_MS,
  AUTH_RETRY_DELAY_MS,
  AUTH_TIMEOUT_MS,
  type AuthResult,
  withAuthTimeout
} from './authUtils.shared';

// Retry unavailable authentication without delaying rendering or reloading
export default function useAuthRecovery(initialAuth: AuthResult) {
  // Associate results with their source props so navigation can't reuse them
  const [recovery, setRecovery] = useState<{
    source: AuthResult;
    result: AuthResult;
    // Keep the connection label active until no more attempts are scheduled
    isConnecting: boolean;
  } | null>(null);
  // Server props remain authoritative until their own recovery finishes
  const auth = recovery?.source === initialAuth ? recovery.result : initialAuth;
  // Initial unknown authentication starts recovery before any result exists
  const isConnecting =
    auth.status === 'unavailable' &&
    (recovery?.source !== initialAuth || recovery.isConnecting);

  useEffect(() => {
    if (initialAuth.status !== 'unavailable') {
      return;
    }
    // Cancel the browser request when navigation replaces this auth state
    const controller = new AbortController();
    // Only schedule another attempt after the previous one has finished
    let retryTimer: ReturnType<typeof setTimeout> | undefined;
    // Count the first request as an attempt, separate from its later retries
    let attempts = 0;

    // Give server verification more time now that the page is usable
    async function recover() {
      attempts += 1;
      // Keep authentication unknown if the service or browser request fails
      let result = initialAuth;
      try {
        // Include the middleware allowance in the browser request's deadline
        result =
          (await withAuthTimeout(async (signal) => {
            // Ask the server to verify identity instead of trusting cookies
            const response = await fetch('/auth/status', {
              cache: 'no-store',
              signal: AbortSignal.any([signal, controller.signal])
            });
            if (!response.ok) {
              throw new Error('Authentication is unavailable');
            }
            return response.json() as Promise<AuthResult>;
          }, AUTH_RECOVERY_TIMEOUT_MS + AUTH_TIMEOUT_MS)) ?? initialAuth;
      } catch {
        // A network failure leaves the local dashboard usable while we retry
      }
      if (controller.signal.aborted) {
        return;
      }
      // Finish offline after the initial request and the allowed retries fail
      const shouldRetry =
        result.status === 'unavailable' && attempts <= AUTH_MAX_RETRIES;
      setRecovery({ source: initialAuth, result, isConnecting: shouldRetry });
      if (shouldRetry) {
        retryTimer = setTimeout(() => void recover(), AUTH_RETRY_DELAY_MS);
      }
    }

    void recover();
    return () => {
      controller.abort();
      clearTimeout(retryTimer);
    };
  }, [initialAuth]);

  return { auth, isConnecting };
}
