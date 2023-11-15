import { POST as SignInPOST } from '@app/auth/sign-in/route';
import SignIn from '@app/sign-in/page';
import '@testing-library/jest-dom';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockCaptchaSuccess } from '@tests/__mocks__/captchaMockUtils';
import fetch from '@tests/__mocks__/fetchMock';
import { supabase } from '@tests/__mocks__/supabaseAuthHelpersMock';
import { renderServerComponent } from '@tests/__utils__/renderServerComponent';
import {
  callRouteHandler,
  convertFormDataToObject,
  typeIntoFormFields
} from '@tests/__utils__/testUtils';
import preview from 'jest-preview';

describe('Sign In page', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should require all form fields to be populated', async () => {
    mockCaptchaSuccess('mytoken');
    await renderServerComponent(<SignIn />);
    const requiredFields = ['Email', 'Password'];
    await userEvent.click(
      await screen.findByRole('button', { name: 'Sign In' })
    );
    requiredFields.forEach(async (labelText) => {
      expect(await screen.findByLabelText(labelText)).toHaveProperty(
        'validity.valueMissing',
        true
      );
    });
  });

  it('should require valid email address', async () => {
    mockCaptchaSuccess('mytoken');
    await renderServerComponent(<SignIn />);
    await typeIntoFormFields({
      Email: 'notanemail'
    });
    expect(await screen.findByLabelText('Email')).toHaveProperty(
      'validity.typeMismatch',
      true
    );
  });

  it('should sign in successfully', async () => {
    mockCaptchaSuccess('mytoken');
    fetch.mockIf(/sign-in/, async () => {
      return JSON.stringify({
        data: {
          user: {
            email: 'caleb@example.com',
            user_metadata: { first_name: 'Caleb', last_name: 'Evans' }
          },
          session: {}
        },
        error: null
      });
    });
    await renderServerComponent(<SignIn />);
    await typeIntoFormFields({
      Email: 'caleb@example.com',
      Password: 'CorrectHorseBatteryStaple'
    });
    await userEvent.click(
      await screen.findByRole('button', { name: 'Sign In' })
    );
    await waitFor(() => {
      preview.debug();
      const [actualFetchUrl, actualFetchOptions] = fetch.mock.calls[0];
      expect(actualFetchUrl).toEqual('/auth/sign-in');
      expect(actualFetchOptions?.method?.toUpperCase()).toEqual('POST');
      expect(convertFormDataToObject(actualFetchOptions?.body)).toEqual({
        email: 'caleb@example.com',
        password: 'CorrectHorseBatteryStaple',
        verification_check: ''
      });
    });
  });

  it('should error if honey pot field is populated', async () => {
    mockCaptchaSuccess('mytoken');
    await renderServerComponent(<SignIn />);
    await typeIntoFormFields({
      Email: 'kaleb@example.com',
      Password: 'CorrectHorseBatteryStaple',
      'Please leave this field blank': 'abc123'
    });
    await userEvent.click(
      await screen.findByRole('button', { name: 'Sign In' })
    );
    expect(
      await screen.findByText('Cannot submit form; please try again')
    ).toBeInTheDocument();
  });

  it('should handle errors from server', async () => {
    mockCaptchaSuccess('mytoken');
    fetch.mockIf(/sign-in/, async () => {
      return JSON.stringify({
        data: {
          user: null,
          session: null
        },
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
    await userEvent.click(
      await screen.findByRole('button', { name: 'Sign In' })
    );
    expect(
      await screen.findByText('Invalid login credentials')
    ).toBeInTheDocument();
  });

  it('should sign in on server side', async () => {
    vi.spyOn(supabase.auth, 'signInWithPassword').mockImplementationOnce(
      async () => {
        return { data: { user: {}, session: {} }, error: null } as any;
      }
    );
    const fields = {
      email: 'caleb@example.com',
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
