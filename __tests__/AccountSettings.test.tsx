import AccountSettings from '@app/account/page';
import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
import { renderServerComponent } from '@tests/__utils__/renderServerComponent';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  mockSupabaseSession,
  mockSupabaseUser
} from './__utils__/supabaseMockUtils';

describe('Account Settings page', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should render when signed in', async () => {
    await mockSupabaseUser();
    await mockSupabaseSession();
    await renderServerComponent(<AccountSettings />);
    expect(
      screen.getByRole('heading', {
        name: 'Account Settings | Faith Dashboard'
      })
    ).toBeInTheDocument();
  });
  it('should redirect to Sign In page if signed out', async () => {
    // Mock the value of the x-url header so that the source code can correctly
    // determine the URL to redirect to (after sign-in)
    jest
      .spyOn(headers(), 'get')
      .mockImplementation(() => 'https://localhost:3000/account');
    await renderServerComponent(<AccountSettings />);
    expect(redirect).toHaveBeenCalledWith(
      `/sign-in?redirect_to=${encodeURIComponent('/account')}`
    );
  });
});
