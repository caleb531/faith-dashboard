import SignIn from '@app/sign-in/page';
import '@testing-library/jest-dom';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockCaptchaSuccessOnce } from '@tests/__mocks__/captchaMockUtils';
import { supabase } from '@tests/__mocks__/supabaseAuthHelpersMock';
import { renderServerComponent } from '@tests/__utils__/renderServerComponent';
import {
  callRouteHandler,
  convertFormDataToObject,
  typeIntoFormFields
} from '@tests/__utils__/testUtils';
import fetch from 'jest-fetch-mock';
import { POST as SignInPOST } from '../app/auth/sign-in/route';

describe('Sign In page', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should require all form fields to be populated', async () => {
    await renderServerComponent(<SignIn />);
    const requiredFields = ['Email', 'Password'];
    await userEvent.click(screen.getByRole('button', { name: 'Sign In' }));
    requiredFields.forEach((labelText) => {
      expect(screen.getByLabelText(labelText)).toHaveProperty(
        'validity.valueMissing',
        true
      );
    });
  });

  it('should require valid email address', async () => {
    await renderServerComponent(<SignIn />);
    await typeIntoFormFields({
      Email: 'notanemail'
    });
    expect(screen.getByLabelText('Email')).toHaveProperty(
      'validity.typeMismatch',
      true
    );
  });

  it('should sign in successfully', async () => {
    mockCaptchaSuccessOnce('mytoken');
    fetch.mockIf(/sign-in/, async () => {
      return JSON.stringify({
        user: {
          email: 'caleb@example.com',
          user_metadata: { first_name: 'Caleb', last_name: 'Evans' }
        },
        session: {},
        error: null
      });
    });
    await renderServerComponent(<SignIn />);
    await typeIntoFormFields({
      Email: 'caleb@example.com',
      Password: 'CorrectHorseBatteryStaple'
    });
    await userEvent.click(screen.getByRole('button', { name: 'Sign In' }));
    const [actualFetchUrl, actualFetchOptions] = fetch.mock.calls[0];
    expect(actualFetchUrl).toEqual('/auth/sign-in');
    expect(actualFetchOptions?.method?.toUpperCase()).toEqual('POST');
    expect(convertFormDataToObject(actualFetchOptions?.body)).toEqual({
      email: 'caleb@example.com',
      password: 'CorrectHorseBatteryStaple',
      verification_check: ''
    });
  });

  it('should error if honey pot field is populated', async () => {
    mockCaptchaSuccessOnce('mytoken');
    await renderServerComponent(<SignIn />);
    await typeIntoFormFields({
      Email: 'kaleb@example.com',
      Password: 'CorrectHorseBatteryStaple',
      'Please leave this field blank': 'abc123'
    });
    await userEvent.click(screen.getByRole('button', { name: 'Sign In' }));
    expect(
      screen.getByText('Cannot submit form; please try again')
    ).toBeInTheDocument();
  });

  it('should handle errors from server', async () => {
    mockCaptchaSuccessOnce('mytoken');
    fetch.mockIf(/sign-in/, async () => {
      return JSON.stringify({
        user: null,
        session: null,
        error: {
          message: 'Invalid login credentials'
        }
      });
    });
    await renderServerComponent(<SignIn />);
    await typeIntoFormFields({
      Email: 'kaleb@example.com',
      Password: 'CorrectHorseBatteryStaple'
    });
    await userEvent.click(screen.getByRole('button', { name: 'Sign In' }));
    await waitFor(() => {
      expect(screen.getByText('Invalid login credentials')).toBeInTheDocument();
    });
  });

  it('should call Supabase API correctly on server', async () => {
    jest
      .spyOn(supabase.auth, 'signInWithPassword')
      .mockImplementationOnce(async () => {
        return { data: { user: {}, session: {} }, error: null } as any;
      });
    const fields = {
      email: 'caleb@calebevans.me',
      password: 'CorrectHorseBatteryStaple',
      'cf-turnstile-response': 'abc123'
    };
    await callRouteHandler({
      handler: SignInPOST,
      path: '/auth/sign-in',
      fields
    });
    expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: fields.email,
      password: fields.password,
      options: {
        captchaToken: fields['cf-turnstile-response']
      }
    });
  });
});
