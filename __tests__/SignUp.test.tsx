import { POST as SignUpPOST } from '@app/auth/sign-up/route';
import SignUp from '@app/sign-up/page';
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

describe('Sign Up page', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should validate that passwords are matching', async () => {
    await renderServerComponent(<SignUp />);
    await typeIntoFormFields({
      Password: 'CorrectHorseBatteryStaple',
      'Confirm Password': 'CorrectHorseBatteryStaple'
    });
    expect(screen.getByLabelText('Confirm Password')).toHaveProperty(
      'validationMessage',
      ''
    );
  });

  it('should validate that passwords are not matching', async () => {
    await renderServerComponent(<SignUp />);
    await typeIntoFormFields({
      Password: 'CorrectHorseBatteryStaple',
      'Confirm Password': 'CorrectHorseBatteryStale'
    });
    expect(screen.getByLabelText('Confirm Password')).toHaveProperty(
      'validationMessage',
      'Passwords must match'
    );
  });

  it('should require all form fields to be populated', async () => {
    await renderServerComponent(<SignUp />);
    const requiredFields = [
      'First Name',
      'Last Name',
      'Email',
      'Password',
      'Confirm Password'
    ];
    await userEvent.click(screen.getByRole('button', { name: 'Sign Up' }));
    requiredFields.forEach((labelText) => {
      expect(screen.getByLabelText(labelText)).toHaveProperty(
        'validity.valueMissing',
        true
      );
    });
  });

  it('should require valid email addresses', async () => {
    await renderServerComponent(<SignUp />);
    await typeIntoFormFields({
      Email: 'notanemail'
    });
    expect(screen.getByLabelText('Email')).toHaveProperty(
      'validity.typeMismatch',
      true
    );
  });

  it('should create account successfully', async () => {
    mockCaptchaSuccessOnce('mytoken');
    fetch.mockIf(/sign-up/, async () => {
      return JSON.stringify({
        user: {
          email: 'john@example.com',
          user_metadata: { first_name: 'John', last_name: 'Doe' }
        },
        session: {},
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
    await userEvent.click(screen.getByRole('button', { name: 'Sign Up' }));
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
  });

  it('should error if honey pot field is populated', async () => {
    mockCaptchaSuccessOnce('mytoken');
    await renderServerComponent(<SignUp />);
    await typeIntoFormFields({
      'First Name': 'John',
      'Last Name': 'Doe',
      Email: 'john@example.com',
      Password: 'CorrectHorseBatteryStaple',
      'Confirm Password': 'CorrectHorseBatteryStaple',
      'Please leave this field blank': 'abc123'
    });
    await userEvent.click(screen.getByRole('button', { name: 'Sign Up' }));
    expect(
      screen.getByText('Cannot submit form; please try again')
    ).toBeInTheDocument();
  });

  it('should handle errors from server', async () => {
    mockCaptchaSuccessOnce('mytoken');
    fetch.mockIf(/sign-up/, async () => {
      return JSON.stringify({
        user: null,
        session: null,
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
    await userEvent.click(screen.getByRole('button', { name: 'Sign Up' }));
    await waitFor(() => {
      expect(screen.getByText('User already registered')).toBeInTheDocument();
    });
  });

  it('should include Sign Up functionality', async () => {
    jest.spyOn(supabase.auth, 'signUp').mockImplementationOnce(async () => {
      return { data: { user: {}, session: {} }, error: null } as any;
    });
    const fields = {
      first_name: 'Caleb',
      last_name: 'Evans',
      email: 'caleb@calebevans.me',
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
        data: {
          first_name: fields.first_name,
          last_name: fields.last_name
        }
      }
    });
  });
  it('should call Supabase API correctly on server', async () => {
    jest.spyOn(supabase.auth, 'signUp').mockImplementationOnce(async () => {
      return { data: { user: {}, session: {} }, error: null } as any;
    });
    const fields = {
      first_name: 'Caleb',
      last_name: 'Evans',
      email: 'caleb@calebevans.me',
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
        data: {
          first_name: fields.first_name,
          last_name: fields.last_name
        }
      }
    });
  });
});
