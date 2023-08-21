import { POST as ResetPasswordPOST } from '@app/auth/reset-password/route';
import ResetPassword from '@app/reset-password/page';
import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { supabase } from '@tests/__mocks__/supabaseAuthHelpersMock';
import { renderServerComponent } from '@tests/__utils__/renderServerComponent';
import {
  callRouteHandler,
  convertFormDataToObject,
  typeIntoFormFields
} from '@tests/__utils__/testUtils';
import fetch from 'jest-fetch-mock';
import {
  mockSupabaseSession,
  mockSupabaseUser
} from './__utils__/supabaseMockUtils';

const originalLocationObject = window.location;

describe('Reset Password page', () => {
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

  it('should validate that passwords are matching', async () => {
    await mockSupabaseUser();
    await mockSupabaseSession();
    await renderServerComponent(<ResetPassword />);
    await typeIntoFormFields({
      'New Password': 'CorrectHorseBatteryStaple',
      'Confirm New Password': 'CorrectHorseBatteryStaple'
    });
    expect(screen.getByLabelText('Confirm New Password')).toHaveProperty(
      'validationMessage',
      ''
    );
  });

  it('should validate that passwords are not matching', async () => {
    await mockSupabaseUser();
    await mockSupabaseSession();
    await renderServerComponent(<ResetPassword />);
    await typeIntoFormFields({
      'New Password': 'CorrectHorseBatteryStaple',
      'Confirm New Password': 'CorrectHorseBatteryStale'
    });
    expect(screen.getByLabelText('Confirm New Password')).toHaveProperty(
      'validationMessage',
      'Passwords must match'
    );
  });

  it('should require all form fields to be populated', async () => {
    await mockSupabaseUser();
    await mockSupabaseSession();
    await renderServerComponent(<ResetPassword />);
    const requiredFields = ['New Password', 'Confirm New Password'];
    await userEvent.click(
      screen.getByRole('button', { name: 'Reset Password' })
    );
    requiredFields.forEach((labelText) => {
      expect(screen.getByLabelText(labelText)).toHaveProperty(
        'validity.valueMissing',
        true
      );
    });
  });

  it('should reset password successfully', async () => {
    await mockSupabaseUser();
    await mockSupabaseSession();
    fetch.mockIf(/reset-password/, async () => {
      return JSON.stringify({
        user: {
          email: 'caleb@example.com',
          user_metadata: { first_name: 'Caleb', last_name: 'Evans' }
        },
        session: {},
        error: null
      });
    });
    await renderServerComponent(<ResetPassword />);
    await typeIntoFormFields({
      'New Password': 'CorrectHorseBatteryStaple',
      'Confirm New Password': 'CorrectHorseBatteryStaple'
    });
    await userEvent.click(
      screen.getByRole('button', { name: 'Reset Password' })
    );
    const [actualFetchUrl, actualFetchOptions] = fetch.mock.calls[0];
    expect(actualFetchUrl).toEqual('/auth/reset-password');
    expect(actualFetchOptions?.method?.toUpperCase()).toEqual('POST');
    expect(convertFormDataToObject(actualFetchOptions?.body)).toEqual({
      new_password: 'CorrectHorseBatteryStaple',
      confirm_new_password: 'CorrectHorseBatteryStaple',
      verification_check: ''
    });
  });

  it('should indicate page is loading when signed out / redirect to signed-in state automatically', async () => {
    window.location.hash = '#access_token=abc123&refresh_token=def234';
    fetch.mockIf(/\/auth\/session/i, async () => {
      return {
        status: 200,
        ok: true,
        body: JSON.stringify({})
      };
    });
    await renderServerComponent(<ResetPassword />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    const [actualFetchUrl, actualFetchOptions] = fetch.mock.calls[0];
    expect(actualFetchUrl).toEqual('/auth/session');
    expect(actualFetchOptions?.method?.toUpperCase()).toEqual('POST');
    expect(convertFormDataToObject(actualFetchOptions?.body)).toEqual({
      access_token: 'abc123',
      refresh_token: 'def234'
    });
    expect(window.location.assign).toHaveBeenCalled();
  });

  it('should click "Click here" link to force refresh', async () => {
    window.location.hash = '#access_token=abc123&refresh_token=def234';
    fetch.mockIf(/\/auth\/session/i, async () => {
      return {
        status: 200,
        ok: true,
        body: JSON.stringify({})
      };
    });
    await renderServerComponent(<ResetPassword />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('link', { name: /CLICK HeRe/i }));
    expect(window.location.reload).toHaveBeenCalled();
  });

  it('should reset password on server side', async () => {
    jest.spyOn(supabase.auth, 'updateUser').mockImplementationOnce(async () => {
      return { data: { user: {}, session: {} }, error: null } as any;
    });
    const fields = {
      new_password: 'CorrectHorseBatteryStaple',
      confirm_new_password: 'CorrectHorseBatteryStaple'
    };
    await callRouteHandler({
      handler: ResetPasswordPOST,
      path: '/auth/reset-password',
      fields
    });
    expect(supabase.auth.updateUser).toHaveBeenCalledWith({
      password: fields.new_password
    });
  });
});
