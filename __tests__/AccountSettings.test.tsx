import AccountSettings from '@app/account/page';
import { POST as CancelEmailChangePOST } from '@app/auth/cancel-email-change/route';
import { POST as ChangePasswordPOST } from '@app/auth/change-password/route';
import { POST as RequestEmailChangePOST } from '@app/auth/request-email-change/route';
import { POST as UpdateUserNamePOST } from '@app/auth/update-user-name/route';
import '@testing-library/jest-dom';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import fetch from '@tests/__mocks__/fetchMock';
import { renderServerComponent } from '@tests/__utils__/renderServerComponent';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { supabase } from './__mocks__/supabaseAuthHelpersMock';
import {
  mockSupabaseSession,
  mockSupabaseUser
} from './__utils__/supabaseMockUtils';
import {
  callRouteHandler,
  convertFormDataToObject,
  mockLocationObject,
  restoreLocationObject,
  typeIntoFormFields
} from './__utils__/testUtils';

describe('Account Settings page', () => {
  beforeEach(() => {
    mockLocationObject();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    restoreLocationObject();
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

  it('should request email change successfully', async () => {
    await mockSupabaseUser();
    await mockSupabaseSession();
    fetch.mockIf(/\/auth\/request-email-change/, async () => {
      return JSON.stringify({});
    });
    await renderServerComponent(<AccountSettings />);
    await typeIntoFormFields(
      {
        'New Email': 'caleb2@example.com',
        'Confirm New Email': 'caleb2@example.com'
      },
      { clearFieldsFirst: true }
    );
    await userEvent.click(screen.getByRole('button', { name: 'Change Email' }));
    const [actualFetchUrl, actualFetchOptions] = fetch.mock.calls[0];
    expect(actualFetchUrl).toEqual('/auth/request-email-change');
    expect(actualFetchOptions?.method?.toUpperCase()).toEqual('POST');
    expect(convertFormDataToObject(actualFetchOptions?.body)).toEqual({
      new_email: 'caleb2@example.com',
      confirm_new_email: 'caleb2@example.com',
      verification_check: ''
    });
    await waitFor(() => {
      expect(window.location.reload).toHaveBeenCalled();
    });
  });

  it('should validate that emails are not matching', async () => {
    await mockSupabaseUser();
    await mockSupabaseSession();
    await renderServerComponent(<AccountSettings />);
    await typeIntoFormFields({
      'New Email': 'caleb2@example.com',
      'Confirm New Email': 'caleb2@example.con'
    });
    expect(screen.getByLabelText('Confirm New Email')).toHaveProperty(
      'validationMessage',
      'Emails must match'
    );
  });

  it('should require all Change Email fields to be populated', async () => {
    await mockSupabaseUser();
    await mockSupabaseSession();
    await renderServerComponent(<AccountSettings />);
    const requiredFields = ['New Email', 'Confirm New Email'];
    await userEvent.click(screen.getByRole('button', { name: 'Change Email' }));
    requiredFields.forEach((labelText) => {
      expect(screen.getByLabelText(labelText)).toHaveProperty(
        'validity.valueMissing',
        true
      );
    });
  });

  it('should cancel email change successfully', async () => {
    await mockSupabaseUser({
      email: 'caleb@example.com',
      new_email: 'caleb2@example.com',
      user_metadata: { first_name: 'Caleb', last_name: 'Evans' }
    });
    await mockSupabaseSession();
    fetch.mockIf(/\/auth\/cancel-email-change/, async () => {
      return JSON.stringify({});
    });
    await renderServerComponent(<AccountSettings />);
    await userEvent.click(
      screen.getByRole('button', { name: 'Cancel Email Change' })
    );
    const [actualFetchUrl, actualFetchOptions] = fetch.mock.calls[0];
    expect(actualFetchUrl).toEqual('/auth/cancel-email-change');
    expect(actualFetchOptions?.method?.toUpperCase()).toEqual('POST');
    await waitFor(() => {
      expect(window.location.reload).toHaveBeenCalled();
    });
  });

  it('should change password successfully', async () => {
    await mockSupabaseUser();
    await mockSupabaseSession();
    fetch.mockIf(/\/auth\/change-password/, async () => {
      return JSON.stringify({});
    });
    await renderServerComponent(<AccountSettings />);
    await typeIntoFormFields({
      'Current Password': 'MyPassword123',
      'New Password': 'CorrectHorseBatteryStaple',
      'Confirm New Password': 'CorrectHorseBatteryStaple'
    });
    await userEvent.click(
      screen.getByRole('button', { name: 'Change Password' })
    );
    const [actualFetchUrl, actualFetchOptions] = fetch.mock.calls[0];
    expect(actualFetchUrl).toEqual('/auth/change-password');
    expect(actualFetchOptions?.method?.toUpperCase()).toEqual('POST');
    expect(convertFormDataToObject(actualFetchOptions?.body)).toEqual({
      current_password: 'MyPassword123',
      new_password: 'CorrectHorseBatteryStaple',
      confirm_new_password: 'CorrectHorseBatteryStaple',
      verification_check: ''
    });
  });

  it('should validate that passwords are not matching', async () => {
    await mockSupabaseUser();
    await mockSupabaseSession();
    await renderServerComponent(<AccountSettings />);
    await typeIntoFormFields({
      'Current Password': 'MyPassword123',
      'New Password': 'CorrectHorseBatteryStaple',
      'Confirm New Password': 'CorrectHorseBatteryStale'
    });
    expect(screen.getByLabelText('Confirm New Password')).toHaveProperty(
      'validationMessage',
      'Passwords must match'
    );
  });

  it('should require all Change Password fields to be populated', async () => {
    await mockSupabaseUser();
    await mockSupabaseSession();
    await renderServerComponent(<AccountSettings />);
    const requiredFields = [
      'Current Password',
      'New Password',
      'Confirm New Password'
    ];
    await userEvent.click(
      screen.getByRole('button', { name: 'Change Password' })
    );
    requiredFields.forEach((labelText) => {
      expect(screen.getByLabelText(labelText)).toHaveProperty(
        'validity.valueMissing',
        true
      );
    });
  });

  it('should change user name on server side', async () => {
    vi.spyOn(supabase.auth, 'updateUser').mockImplementationOnce(async () => {
      return { data: {}, error: null } as any;
    });
    const fields = {
      first_name: 'Twin',
      last_name: 'Caleb'
    };
    await callRouteHandler({
      handler: UpdateUserNamePOST,
      path: '/auth/update-user-name',
      fields
    });
    expect(supabase.auth.updateUser).toHaveBeenCalledWith({
      data: {
        first_name: fields.first_name,
        last_name: fields.last_name
      }
    });
  });

  it('should change password on server side', async () => {
    vi.spyOn(supabase, 'rpc').mockImplementationOnce(() => {
      return { data: {}, error: null } as any;
    });
    const fields = {
      current_password: 'MyPassword123',
      new_password: 'CorrectHorseBatteryStaple',
      confirm_new_password: 'CorrectHorseBatteryStaple'
    };
    await callRouteHandler({
      handler: ChangePasswordPOST,
      path: '/auth/change-password',
      fields
    });
    expect(supabase.rpc).toHaveBeenCalledWith('change_user_password', {
      current_password: fields.current_password,
      new_password: fields.new_password
    });
  });

  it('should request email change on server side', async () => {
    vi.spyOn(supabase.auth, 'updateUser').mockImplementationOnce(() => {
      return { data: {}, error: null } as any;
    });
    const fields = {
      new_email: 'caleb2@example.com',
      confirm_new_email: 'caleb2@example.com'
    };
    await callRouteHandler({
      handler: RequestEmailChangePOST,
      path: '/auth/request-email-change',
      fields
    });
    expect(supabase.auth.updateUser).toHaveBeenCalledWith({
      email: fields.new_email
    });
  });

  it('should cancel email change on server side', async () => {
    vi.spyOn(supabase, 'rpc').mockImplementationOnce(() => {
      return { data: {}, error: null } as any;
    });
    await callRouteHandler({
      handler: CancelEmailChangePOST,
      path: '/auth/cancel-email-change',
      fields: {}
    });
    expect(supabase.rpc).toHaveBeenCalledWith('cancel_email_change');
  });
});
