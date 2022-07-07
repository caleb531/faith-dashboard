import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Home from '../../pages/index';
import { supabase } from '../supabaseClient';
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
      reload: jest.fn()
    };
  });

  afterEach(() => {
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
    mockSupabaseUser();
    mockSupabaseSession();
    mockConfirm(() => true);
    const signOutMock = jest
      .spyOn(supabase.auth, 'signOut')
      .mockImplementation(() => {
        return {
          error: null
        } as any;
      });
    render(<Home />);
    await userEvent.click(screen.getByRole('button', { name: 'Your Account' }));
    localStorage.setItem('faith-dashboard-whatever', 'true');
    const log = jest.spyOn(console, 'log').mockImplementation(() => {
      // noop
    });
    await userEvent.click(screen.getByText('Sign Out'));
    log.mockReset();
    expect(localStorage.getItem('faith-dashboard-whatever')).toEqual(null);
    signOutMock.mockRestore();
  });

  it('should cancel signing out', async () => {
    mockSupabaseUser();
    mockSupabaseSession();
    mockConfirm(() => false);
    const signOutMock = jest
      .spyOn(supabase.auth, 'signOut')
      .mockImplementation(() => {
        return {
          error: null
        } as any;
      });
    render(<Home />);
    await userEvent.click(screen.getByRole('button', { name: 'Your Account' }));
    localStorage.setItem('faith-dashboard-whatever', 'true');
    await userEvent.click(screen.getByText('Sign Out'));
    expect(localStorage.getItem('faith-dashboard-whatever')).toEqual('true');
    signOutMock.mockRestore();
  });
});
