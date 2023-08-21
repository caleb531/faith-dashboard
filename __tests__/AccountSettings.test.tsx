import AccountSettings from '@app/account/page';
import '@testing-library/jest-dom';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderServerComponent } from '@tests/__utils__/renderServerComponent';
import fetch from 'jest-fetch-mock';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  mockSupabaseSession,
  mockSupabaseUser
} from './__utils__/supabaseMockUtils';
import {
  convertFormDataToObject,
  typeIntoFormFields
} from './__utils__/testUtils';

const originalLocationObject = window.location;

describe('Account Settings page', () => {
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

  it('should update name of user successfully', async () => {
    await mockSupabaseUser();
    await mockSupabaseSession();
    fetch.mockIf(/\/auth\/update-user-name/, async () => {
      return JSON.stringify({});
    });
    await renderServerComponent(<AccountSettings />);
    await typeIntoFormFields(
      {
        'First Name': 'Twin',
        'Last Name': 'Caleb'
      },
      { clearFieldsFirst: true }
    );
    await userEvent.click(screen.getByRole('button', { name: 'Save Details' }));
    const [actualFetchUrl, actualFetchOptions] = fetch.mock.calls[0];
    expect(actualFetchUrl).toEqual('/auth/update-user-name');
    expect(actualFetchOptions?.method?.toUpperCase()).toEqual('POST');
    expect(convertFormDataToObject(actualFetchOptions?.body)).toEqual({
      first_name: 'Twin',
      last_name: 'Caleb',
      verification_check: ''
    });
    await waitFor(() => {
      expect(window.location.reload).toHaveBeenCalled();
    });
  });
});
