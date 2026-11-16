import Home from '@app/page';
import App from '@components/app/App';
import LandingPage from '@components/LandingPage';
import * as serverAuth from '@components/authUtils.server';
import {
  AUTH_RECOVERY_TIMEOUT_MS,
  AUTH_RETRY_DELAY_MS,
  AUTH_TIMEOUT_MS,
  type AuthResult
} from '@components/authUtils.shared';
import { assignLocation } from '@components/navigationUtils';
import {
  act,
  fireEvent,
  renderHook,
  screen,
  waitFor,
  within
} from '@testing-library/react';
import { hydrateRoot, type Root } from 'react-dom/client';
import { renderToString } from 'react-dom/server.node';
import useAuthRecovery from '@components/useAuthRecovery';
import '@testing-library/jest-dom';
import fetch from 'jest-fetch-mock';
import { redirect } from 'next/navigation';
import { renderServerComponent } from './__utils__/renderServerComponent';
import { supabase } from './__mocks__/supabaseAuthHelpersMock';
import {
  mockSupabaseSession,
  mockSupabaseUser
} from './__utils__/supabaseMockUtils';

jest.mock('@components/navigationUtils');

// A timed-out check has neither confirmed nor rejected the user's credentials
const unavailable: AuthResult = {
  status: 'unavailable',
  user: null,
  session: null
};

describe('Authentication recovery', () => {
  // Restore the real server lookup after each page-rendering test
  let authStub: jest.SpyInstance;

  beforeEach(() => {
    authStub = jest.spyOn(serverAuth, 'getAuth').mockResolvedValue(unavailable);
    jest.mocked(assignLocation).mockClear();
    jest.mocked(redirect).mockClear();
  });

  afterEach(() => {
    authStub.mockRestore();
    jest.useRealTimers();
  });

  it('updates signed-in controls after a response slower than the render budget', async () => {
    jest.useFakeTimers();
    await mockSupabaseUser();
    await mockSupabaseSession();
    // The recovery endpoint returns a verified user and the matching session
    const result: AuthResult = {
      status: 'authenticated',
      user: (await supabase.auth.getUser()).data.user!,
      session: (await supabase.auth.getSession()).data.session!
    };
    // Keep the response pending long enough to exceed server rendering's limit
    let finishRecovery: ((body: string) => void) | undefined;
    fetch.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          finishRecovery = (body) => resolve(new Response(body));
        })
    );
    await renderServerComponent(<Home />);
    // Connection feedback stays in the existing header rather than a banner
    const connecting = screen.getByRole('button', { name: 'Connecting...' });
    expect(connecting).toHaveAttribute('aria-disabled', 'true');
    expect(connecting).toHaveAttribute('title', 'Connecting...');
    fireEvent.click(connecting);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Sign Up/In' })
    ).not.toBeInTheDocument();
    await act(async () => {
      await jest.advanceTimersByTimeAsync(3000);
      finishRecovery!(JSON.stringify(result));
    });
    expect(
      screen.getByRole('button', { name: 'Your Account' })
    ).toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('keeps protected content blocked and redirects only after confirming logout', async () => {
    // Hold recovery while checking that protected children aren't displayed
    let finishRecovery: ((response: Response) => void) | undefined;
    fetch.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          finishRecovery = resolve;
        })
    );
    await renderServerComponent(
      <LandingPage heading="Account" isProtected>
        <p>Protected content</p>
      </LandingPage>
    );
    expect(screen.queryByText('Protected content')).not.toBeInTheDocument();
    expect(redirect).not.toHaveBeenCalled();
    await act(async () => {
      finishRecovery!(
        new Response(
          JSON.stringify({ status: 'anonymous', user: null, session: null })
        )
      );
    });
    expect(assignLocation).toHaveBeenCalledWith('/sign-in');
    expect(screen.queryByText('Protected content')).not.toBeInTheDocument();
  });

  it('opens protected content after successful background verification', async () => {
    await mockSupabaseUser();
    await mockSupabaseSession();
    // The recovery response has been verified by the server endpoint
    const result: AuthResult = {
      status: 'authenticated',
      user: (await supabase.auth.getUser()).data.user!,
      session: (await supabase.auth.getSession()).data.session!
    };
    fetch.mockResponseOnce(JSON.stringify(result));
    await renderServerComponent(
      <LandingPage heading="Account" isProtected>
        <p>Protected content</p>
      </LandingPage>
    );
    await waitFor(() =>
      expect(screen.getByText('Protected content')).toBeInTheDocument()
    );
    expect(redirect).not.toHaveBeenCalled();
    expect(assignLocation).not.toHaveBeenCalled();
  });

  it('retries automatically after an outage and stops once authentication resolves', async () => {
    jest.useFakeTimers();
    fetch.mockRejectOnce(new Error('Network unavailable'));
    await renderServerComponent(<Home />);
    expect(
      screen.getByRole('button', { name: 'Connecting...' })
    ).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledTimes(1);
    fetch.mockResponseOnce(
      JSON.stringify({ status: 'anonymous', user: null, session: null })
    );
    await act(async () => {
      await jest.advanceTimersByTimeAsync(AUTH_RETRY_DELAY_MS - 1);
    });
    expect(fetch).toHaveBeenCalledTimes(1);
    await act(async () => {
      await jest.advanceTimersByTimeAsync(1);
    });
    expect(
      screen.getByRole('button', { name: 'Sign Up/In' })
    ).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledTimes(2);
    await act(async () => {
      await jest.advanceTimersByTimeAsync(AUTH_RETRY_DELAY_MS);
    });
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it('bounds stalled requests before scheduling another automatic attempt', async () => {
    jest.useFakeTimers();
    fetch.mockImplementationOnce(
      () =>
        new Promise(() => {
          // Simulate a network request that ignores cancellation
        })
    );
    await renderServerComponent(<Home />);
    await act(async () => {
      await jest.advanceTimersByTimeAsync(
        AUTH_RECOVERY_TIMEOUT_MS + AUTH_TIMEOUT_MS
      );
    });
    expect(
      screen.getByRole('button', { name: 'Connecting...' })
    ).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch.mock.calls[0][1]?.signal?.aborted).toBe(true);
    fetch.mockResponseOnce(
      JSON.stringify({ status: 'anonymous', user: null, session: null })
    );
    await act(async () => {
      await jest.advanceTimersByTimeAsync(AUTH_RETRY_DELAY_MS);
    });
    expect(
      screen.getByRole('button', { name: 'Sign Up/In' })
    ).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it('cancels scheduled retries when the page is unmounted', async () => {
    jest.useFakeTimers();
    fetch.mockRejectOnce(new Error('Network unavailable'));
    // Exercise cleanup without unrelated dashboard timers
    const { unmount } = renderHook(() => useAuthRecovery(unavailable));
    await act(async () => {
      await jest.advanceTimersByTimeAsync(0);
    });
    expect(fetch).toHaveBeenCalledTimes(1);
    unmount();
    await act(async () => {
      await jest.advanceTimersByTimeAsync(AUTH_RETRY_DELAY_MS);
    });
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(jest.getTimerCount()).toBe(0);
  });

  it('shows Offline and stops after two failed retries without revealing protected content', async () => {
    jest.useFakeTimers();
    fetch.mockResponse(JSON.stringify(unavailable));
    await renderServerComponent(
      <LandingPage heading="Account" isProtected>
        <p>Protected content</p>
      </LandingPage>
    );
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(
      screen.getByRole('button', { name: 'Connecting...' })
    ).toBeInTheDocument();
    await act(async () => {
      await jest.advanceTimersByTimeAsync(AUTH_RETRY_DELAY_MS);
    });
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(
      screen.getByRole('button', { name: 'Connecting...' })
    ).toBeInTheDocument();
    await act(async () => {
      await jest.advanceTimersByTimeAsync(AUTH_RETRY_DELAY_MS);
    });
    expect(fetch).toHaveBeenCalledTimes(3);
    // Exhaustion leaves credentials unknown rather than claiming a logout
    const offline = screen.getByRole('button', { name: 'Offline' });
    expect(offline).toHaveAttribute(
      'title',
      expect.stringContaining('local dashboard is still available')
    );
    expect(offline).toHaveAttribute('aria-disabled', 'true');
    expect(screen.queryByText('Protected content')).not.toBeInTheDocument();
    expect(redirect).not.toHaveBeenCalled();
    fireEvent.click(offline);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await act(async () => {
      await jest.advanceTimersByTimeAsync(AUTH_RETRY_DELAY_MS * 5);
    });
    expect(fetch).toHaveBeenCalledTimes(3);
  });

  it.each([2000, 3600000])(
    'hydrates without a mismatch if the client clock advances by %i milliseconds',
    async (clockAdvanceMs) => {
      // Render a verified session just before its expiration
      const serverNow = 1800000000000;
      // The client may hydrate after expiration or have a faster clock
      const clock = jest.spyOn(Date, 'now').mockReturnValue(serverNow);
      // Hydrate the actual App so its header uses the production auth logic
      const container = document.createElement('div');
      // React reports mismatched server markup through this callback
      const hydrationErrors = jest.fn();
      // The root must be unmounted even if an assertion fails
      let root: Root | undefined;
      try {
        await mockSupabaseUser();
        await mockSupabaseSession({ expires_at: serverNow / 1000 + 1 });
        // The same serialized auth result reaches both renders
        const auth: AuthResult = {
          status: 'authenticated',
          user: (await supabase.auth.getUser()).data.user!,
          session: (await supabase.auth.getSession()).data.session!
        };
        document.body.appendChild(container);
        container.innerHTML = renderToString(
          <App auth={auth}>
            <p>Dashboard</p>
          </App>
        );
        expect(
          within(container).getByRole('button', { name: 'Your Account' })
        ).toBeInTheDocument();
        clock.mockReturnValue(serverNow + clockAdvanceMs);
        await act(async () => {
          root = hydrateRoot(
            container,
            <App auth={auth}>
              <p>Dashboard</p>
            </App>,
            {
              onRecoverableError: hydrationErrors
            }
          );
        });
        expect(hydrationErrors).not.toHaveBeenCalled();
        // Normal expiry checks still run once hydration has completed
        expect(
          within(container).getByRole('button', { name: 'Sign Up/In' })
        ).toBeInTheDocument();
      } finally {
        await act(async () => root?.unmount());
        container.remove();
        clock.mockRestore();
      }
    }
  );
});
