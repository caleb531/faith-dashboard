import { getAuth } from '@components/authUtils.server';
import { createSupabaseServerClient } from '@components/authUtils.serverClient';
import { GET } from '@app/auth/status/route';
import * as ssr from '@supabase/ssr';
import type { CookieMethodsServer } from '@supabase/ssr';
import { AUTH_TIMEOUT_MS, withAuthTimeout } from '@components/authUtils.shared';
import { AuthApiError, AuthSessionMissingError } from '@supabase/supabase-js';
import { supabase } from './__mocks__/supabaseAuthHelpersMock';
import {
  mockSupabaseSession,
  mockSupabaseUser
} from './__utils__/supabaseMockUtils';

describe('Bounded authentication', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('returns at the deadline and aborts the operation', async () => {
    // Capture the signal without allowing the operation to finish
    let receivedSignal: AbortSignal | undefined;
    // The operation stays pending even after cancellation, like SDK backoff
    const result = withAuthTimeout((signal) => {
      receivedSignal = signal;
      return new Promise<never>(() => {
        // Only the deadline can finish this wait
      });
    });
    await jest.advanceTimersByTimeAsync(AUTH_TIMEOUT_MS - 1);
    expect(receivedSignal?.aborted).toBe(false);
    await jest.advanceTimersByTimeAsync(1);
    await expect(result).resolves.toBeNull();
    expect(receivedSignal?.aborted).toBe(true);
    expect(jest.getTimerCount()).toBe(0);
  });

  it('clears the deadline when the operation succeeds', async () => {
    await expect(withAuthTimeout(async () => 'verified')).resolves.toBe(
      'verified'
    );
    expect(jest.getTimerCount()).toBe(0);
  });

  it('propagates unexpected exceptions and clears the deadline', async () => {
    // Programming errors must not be disguised as a service outage
    const error = new Error('Unexpected failure');
    await expect(
      withAuthTimeout(async () => {
        throw error;
      })
    ).rejects.toBe(error);
    expect(jest.getTimerCount()).toBe(0);
  });

  it('verifies the user once before retrieving the session', async () => {
    await mockSupabaseUser();
    await mockSupabaseSession();
    jest.mocked(supabase.auth.getUser).mockClear();
    // The session must come from the client used for this verification
    const result = await getAuth();
    expect(result.status).toBe('authenticated');
    expect(supabase.auth.getUser).toHaveBeenCalledTimes(1);
    expect(supabase.auth.getSession).toHaveBeenCalledTimes(1);
    expect(
      jest.mocked(supabase.auth.getUser).mock.invocationCallOrder[0]
    ).toBeLessThan(
      jest.mocked(supabase.auth.getSession).mock.invocationCallOrder[0]
    );
  });

  it('distinguishes a missing session from an unavailable service', async () => {
    jest.mocked(supabase.auth.getSession).mockClear();
    jest.mocked(supabase.auth.getUser).mockResolvedValueOnce({
      data: { user: null },
      error: new AuthSessionMissingError()
    });
    await expect(getAuth()).resolves.toMatchObject({ status: 'anonymous' });
    jest.mocked(supabase.auth.getUser).mockResolvedValueOnce({
      data: { user: null },
      error: new AuthApiError('Unavailable', 503, undefined)
    });
    await expect(getAuth()).resolves.toMatchObject({ status: 'unavailable' });
    expect(supabase.auth.getSession).not.toHaveBeenCalled();
  });

  it('returns unknown authentication when the user lookup stalls', async () => {
    jest.mocked(supabase.auth.getUser).mockImplementationOnce(
      () =>
        new Promise(() => {
          // Simulate a request that never reaches the service
        })
    );
    // Start the complete server lookup before advancing its deadline
    const result = getAuth();
    await jest.advanceTimersByTimeAsync(AUTH_TIMEOUT_MS);
    await expect(result).resolves.toEqual({
      status: 'unavailable',
      user: null,
      session: null
    });
  });

  it('ignores cookie writes that arrive after cancellation', async () => {
    // Capture the SDK cookie adapter while retaining the existing client mock
    let cookieMethods: CookieMethodsServer | undefined;
    // The unwrapped constructor is used only while this spy captures options
    const originalCreateClient = ssr.createServerClient;
    // No cookies should reach the response after the deadline has passed
    const setAll = jest.fn();
    // Cancellation is controlled directly to exercise a late SDK callback
    const controller = new AbortController();
    // Inspect the shared wrapper rather than relying on an SDK network response
    const createClient = jest
      .spyOn(ssr, 'createServerClient')
      .mockImplementationOnce((url, key, options) => {
        cookieMethods = options!.cookies as CookieMethodsServer;
        return originalCreateClient(url, key, options!);
      });
    try {
      createSupabaseServerClient(
        { getAll: () => [], setAll },
        controller.signal
      );
      controller.abort();
      await cookieMethods!.setAll!(
        [{ name: 'session', value: 'late-refresh', options: {} }],
        { 'Cache-Control': 'private, no-store' }
      );
      expect(setAll).not.toHaveBeenCalled();
    } finally {
      createClient.mockRestore();
    }
  });

  it('never caches the recovery endpoint response', async () => {
    // Even a signed-out response must not be reused for another visitor
    const response = await GET();
    expect(response.headers.get('Cache-Control')).toBe('private, no-store');
    await expect(response.json()).resolves.toMatchObject({
      status: 'anonymous'
    });
  });
});
