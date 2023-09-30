import { POST as SignOutPOST } from '@app/auth/sign-out/route';
import Home from '@app/page';
import { getSession, getUser } from '@components/authUtils.client';
import '@testing-library/jest-dom';
import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { supabase } from '@tests/__mocks__/supabaseAuthHelpersMock';
import { renderServerComponent } from '@tests/__utils__/renderServerComponent';
import {
  mockSupabaseSession,
  mockSupabaseUser
} from '@tests/__utils__/supabaseMockUtils';
import {
  callRouteHandler,
  mockConfirmOnce,
  mockLocationObject,
  restoreLocationObject
} from '@tests/__utils__/testUtils';
import fetch from 'jest-fetch-mock';

describe('Account Header', () => {
  beforeEach(() => {
    mockLocationObject();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    restoreLocationObject();
  });

  it('should provide links to Sign Up / Sign In when not signed in', async () => {
    await renderServerComponent(<Home />);
    await userEvent.click(screen.getByRole('button', { name: 'Sign Up/In' }));
    expect(screen.getByRole('link', { name: 'Sign Up' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Sign In' })).toBeInTheDocument();
  });

  it('should close Sign Up / Sign In modal', async () => {
    await renderServerComponent(<Home />);
    await userEvent.click(screen.getByRole('button', { name: 'Sign Up/In' }));
    expect(
      screen.getByRole('heading', { name: 'Account' })
    ).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Close Modal' }));
    expect(
      screen.queryByRole('heading', { name: 'Account' })
    ).not.toBeInTheDocument();
  });

  it('should Sign Out', async () => {
    await mockSupabaseUser();
    await mockSupabaseSession();
    fetch.mockIf(/sign-out/i, async () => {
      return JSON.stringify({ success: true });
    });
    mockConfirmOnce(() => true);
    vi.spyOn(supabase.auth, 'signOut').mockImplementation(() => {
      return {
        error: null
      } as any;
    });
    await renderServerComponent(<Home />);
    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'Your Account' })
      ).toBeInTheDocument();
    });
    await userEvent.click(screen.getByRole('button', { name: 'Your Account' }));
    localStorage.setItem('faith-dashboard-whatever', 'true');
    const log = vi.spyOn(console, 'log').mockImplementation(() => {
      // noop
    });
    await userEvent.click(screen.getByText('Sign Out'));
    log.mockReset();
    expect(localStorage.getItem('faith-dashboard-whatever')).toEqual(null);
    await act(async () => {
      await getUser();
      await getSession();
    });
  });

  it('should close menu by clicking overlay', async () => {
    await mockSupabaseUser();
    await mockSupabaseSession();
    await renderServerComponent(<Home />);
    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'Your Account' })
      ).toBeInTheDocument();
    });
    await userEvent.click(screen.getByRole('button', { name: 'Your Account' }));
    const overlay = screen.getByRole('button', { name: 'Close Menu' });
    expect(overlay).toBeInTheDocument();
    await userEvent.click(overlay);
    expect(overlay).not.toBeInTheDocument();
  });

  it('should cancel signing out', async () => {
    await mockSupabaseUser();
    await mockSupabaseSession();
    mockConfirmOnce(() => false);
    vi.spyOn(supabase.auth, 'signOut').mockImplementation(() => {
      return {
        error: null
      } as any;
    });
    await renderServerComponent(<Home />);
    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'Your Account' })
      ).toBeInTheDocument();
    });
    await userEvent.click(screen.getByRole('button', { name: 'Your Account' }));
    localStorage.setItem('faith-dashboard-whatever', 'true');
    await userEvent.click(screen.getByText('Sign Out'));
    expect(localStorage.getItem('faith-dashboard-whatever')).toEqual('true');
    await act(async () => {
      await getUser();
      await getSession();
    });
  });

  it('should sign out on server side', async () => {
    vi.spyOn(supabase.auth, 'signOut').mockImplementationOnce(async () => {
      return { data: { user: {}, session: {} }, error: null } as any;
    });
    await callRouteHandler({
      handler: SignOutPOST,
      path: '/auth/sign-out',
      fields: {}
    });
    expect(supabase.auth.signOut).toHaveBeenCalledWith();
  });
});
