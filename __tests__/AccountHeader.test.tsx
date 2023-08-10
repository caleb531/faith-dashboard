import '@testing-library/jest-dom';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getSession, getUser } from '../components/accountUtils';
import { supabase } from '../components/supabaseClient';
import Home from '../pages/index';
import {
  mockSupabaseSession,
  mockSupabaseUser
} from './__mocks__/supabaseMockUtils';
import { mockConfirm } from './__utils__/testUtils';

const originalLocationObject = window.location;

describe('Account Header', () => {
  beforeEach(() => {
    // @ts-ignore (see <https://stackoverflow.com/a/61649798/560642>)
    delete window.location;
    window.location = {
      ...originalLocationObject,
      reload: jest.fn(),
      assign: jest.fn()
    };
  });

  afterEach(() => {
    jest.restoreAllMocks();
    window.location = originalLocationObject;
  });

  it('should provide links to Sign Up / Sign In when not signed in', async () => {
    render(<Home />);
    await userEvent.click(screen.getByRole('button', { name: 'Sign Up/In' }));
    expect(screen.getByRole('link', { name: 'Sign Up' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Sign In' })).toBeInTheDocument();
  });

  it('should close Sign Up / Sign In modal', async () => {
    render(<Home />);
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
    mockConfirm(() => true);
    jest.spyOn(supabase.auth, 'signOut').mockImplementation(() => {
      return {
        error: null
      } as any;
    });
    render(<Home />);
    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'Your Account' })
      ).toBeInTheDocument();
    });
    await userEvent.click(screen.getByRole('button', { name: 'Your Account' }));
    localStorage.setItem('faith-dashboard-whatever', 'true');
    const log = jest.spyOn(console, 'log').mockImplementation(() => {
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
    render(<Home />);
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
    mockConfirm(() => false);
    jest.spyOn(supabase.auth, 'signOut').mockImplementation(() => {
      return {
        error: null
      } as any;
    });
    render(<Home />);
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
});
