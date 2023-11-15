import { GET as CallbackGET } from '@app/auth/callback/route';
import { POST as SignUpPOST } from '@app/auth/sign-up/route';
import SignUp from '@app/sign-up/page';
import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockCaptchaSuccess } from '@tests/__mocks__/captchaMockUtils';
import fetch from '@tests/__mocks__/fetchMock';
import { supabase } from '@tests/__mocks__/supabaseAuthHelpersMock';
import { renderServerComponent } from '@tests/__utils__/renderServerComponent';
import {
  callRouteHandler,
  convertFormDataToObject,
  mockLocationObject,
  restoreLocationObject,
  typeIntoFormFields
} from '@tests/__utils__/testUtils';

import { NextResponse } from 'next/server';

describe('Sign Up page', () => {
  beforeEach(() => {
    mockLocationObject();
  });
  afterEach(() => {
    vi.restoreAllMocks();
    restoreLocationObject();
  });

  it('should validate that passwords are matching', async () => {
    mockCaptchaSuccess('mytoken');
    await renderServerComponent(<SignUp />);
    await typeIntoFormFields({
      Password: 'CorrectHorseBatteryStaple',
      'Confirm Password': 'CorrectHorseBatteryStaple'
    });
    expect(await screen.findByLabelText('Confirm Password')).toHaveProperty(
      'validationMessage',
      ''
    );
  });

  it('should validate that passwords are not matching', async () => {
    mockCaptchaSuccess('mytoken');
    await renderServerComponent(<SignUp />);
    await typeIntoFormFields({
      Password: 'CorrectHorseBatteryStaple',
      'Confirm Password': 'CorrectHorseBatteryStale'
    });
    expect(await screen.findByLabelText('Confirm Password')).toHaveProperty(
      'validationMessage',
      'Passwords must match'
    );
  });

  it('should require all form fields to be populated', async () => {
    mockCaptchaSuccess('mytoken');
    await renderServerComponent(<SignUp />);
    const requiredFields = [
      'First Name',
      'Last Name',
      'Email',
      'Password',
      'Confirm Password'
    ];
    await userEvent.click(
      await screen.findByRole('button', { name: 'Sign Up' })
    );
    requiredFields.forEach(async (labelText) => {
      expect(await screen.findByLabelText(labelText)).toHaveProperty(
        'validity.valueMissing',
        true
      );
    });
  });

  it('should require valid email addresses', async () => {
    mockCaptchaSuccess('mytoken');
    await renderServerComponent(<SignUp />);
    await typeIntoFormFields({
      Email: 'notanemail'
    });
    expect(await screen.findByLabelText('Email')).toHaveProperty(
      'validity.typeMismatch',
      true
    );
  });

  it('should create account successfully', async () => {
    mockCaptchaSuccess('mytoken');
    fetch.mockIf(/sign-up/, async () => {
      return JSON.stringify({
        data: {
          user: {
            email: 'john@example.com',
            user_metadata: { first_name: 'John', last_name: 'Doe' }
          },
          session: {}
        },
        error: null
      });
    });
    await renderServerComponent(<SignUp />);
    await typeIntoFormFields({
      'First Name': 'John',
      'Last Name': 'Doe',
      Email: 'john@example.com',
      Password: 'CorrectHorseBatteryStaple',
      'Confirm Password': 'CorrectHorseBatteryStaple'
    });
    await userEvent.click(
      await screen.findByRole('button', { name: 'Sign Up' })
    );
    const [actualFetchUrl, actualFetchOptions] = fetch.mock.calls[0];
    expect(actualFetchUrl).toEqual('/auth/sign-up');
    expect(actualFetchOptions?.method?.toUpperCase()).toEqual('POST');
    expect(convertFormDataToObject(actualFetchOptions?.body)).toEqual({
      email: 'john@example.com',
      password: 'CorrectHorseBatteryStaple',
      confirm_password: 'CorrectHorseBatteryStaple',
      first_name: 'John',
      last_name: 'Doe',
      verification_check: ''
    });
    expect(window.location.assign).toHaveBeenCalled();
  });

  it('should indicate if email needs to be confirmed post-sign up', async () => {
    mockCaptchaSuccess('mytoken');
    fetch.mockIf(/sign-up/, async () => {
      return JSON.stringify({
        data: {
          user: {
            email: 'john@example.com',
            user_metadata: { first_name: 'John', last_name: 'Doe' },
            confirmation_sent_at: '2023-09-01T00:00:00'
          },
          session: {}
        },
        error: null
      });
    });
    await renderServerComponent(<SignUp />);
    await typeIntoFormFields({
      'First Name': 'John',
      'Last Name': 'Doe',
      Email: 'john@example.com',
      Password: 'CorrectHorseBatteryStaple',
      'Confirm Password': 'CorrectHorseBatteryStaple'
    });
    await userEvent.click(
      await screen.findByRole('button', { name: 'Sign Up' })
    );
    const [actualFetchUrl, actualFetchOptions] = fetch.mock.calls[0];
    expect(actualFetchUrl).toEqual('/auth/sign-up');
    expect(actualFetchOptions?.method?.toUpperCase()).toEqual('POST');
    expect(
      await screen.findByText(
        'Almost done! Please check your email to activate your account'
      )
    ).toBeInTheDocument();
  });

  it('should error if honey pot field is populated', async () => {
    mockCaptchaSuccess('mytoken');
    await renderServerComponent(<SignUp />);
    await typeIntoFormFields({
      'First Name': 'John',
      'Last Name': 'Doe',
      Email: 'john@example.com',
      Password: 'CorrectHorseBatteryStaple',
      'Confirm Password': 'CorrectHorseBatteryStaple',
      'Please leave this field blank': 'abc123'
    });
    await userEvent.click(
      await screen.findByRole('button', { name: 'Sign Up' })
    );
    expect(
      await screen.findByText('Cannot submit form; please try again')
    ).toBeInTheDocument();
  });

  it('should handle errors from server', async () => {
    mockCaptchaSuccess('mytoken');
    fetch.mockIf(/sign-up/, async () => {
      return JSON.stringify({
        data: {
          user: null,
          session: null
        },
        error: {
          message: 'User already registered'
        }
      });
    });
    await renderServerComponent(<SignUp />);
    await typeIntoFormFields({
      'First Name': 'John',
      'Last Name': 'Doe',
      Email: 'john@example.com',
      Password: 'CorrectHorseBatteryStaple',
      'Confirm Password': 'CorrectHorseBatteryStaple'
    });
    await userEvent.click(
      await screen.findByRole('button', { name: 'Sign Up' })
    );
    expect(
      await screen.findByText('User already registered')
    ).toBeInTheDocument();
  });

  it('should sign up on server side', async () => {
    vi.spyOn(supabase.auth, 'signUp').mockImplementationOnce(async () => {
      return { data: { user: {}, session: {} }, error: null } as any;
    });
    const fields = {
      first_name: 'Caleb',
      last_name: 'Evans',
      email: 'caleb@example.com',
      password: 'CorrectHorseBatteryStaple',
      'cf-turnstile-response': 'abc123'
    };
    await callRouteHandler({
      handler: SignUpPOST,
      path: '/auth/sign-up',
      fields
    });
    expect(supabase.auth.signUp).toHaveBeenCalledWith({
      email: fields.email,
      password: fields.password,
      options: {
        captchaToken: fields['cf-turnstile-response'],
        emailRedirectTo: 'http://localhost:3000/auth/callback',
        data: {
          first_name: fields.first_name,
          last_name: fields.last_name
        }
      }
    });
  });

  it('should exchange code for session upon email confirmation', async () => {
    vi.spyOn(supabase.auth, 'exchangeCodeForSession').mockImplementationOnce(
      async () => {
        return { data: { user: {}, session: {} }, error: null } as any;
      }
    );
    vi.spyOn(NextResponse, 'redirect');
    const code = 'dfbc19a6-f750-4620-8390-56f3158a299d';
    await callRouteHandler({
      handler: CallbackGET,
      path: `/auth/callback?code=${code}`,
      method: 'GET'
    });
    expect(supabase.auth.exchangeCodeForSession).toHaveBeenCalledWith(code);
    expect(NextResponse.redirect).toHaveBeenCalledWith('http://localhost:3000');
  });
  it('should redirect to error page when email confirmation code is missing', async () => {
    vi.spyOn(NextResponse, 'redirect');
    await callRouteHandler({
      handler: CallbackGET,
      path: `/auth/callback`,
      method: 'GET'
    });
    expect(NextResponse.redirect).toHaveBeenCalledWith(
      `http://localhost:3000#message=${encodeURIComponent(
        'There was an error confirming your email. Please contact support at support@faithdashboard.com'
      )}`
    );
  });
});
