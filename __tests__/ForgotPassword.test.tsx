import { POST as RequestPasswordResetPOST } from '@app/auth/request-password-reset/route';
import ForgotPassword from '@app/forgot-password/page';
import SignIn from '@app/sign-in/page';
import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderServerComponent } from '@tests/__utils__/renderServerComponent';
import {
  callRouteHandler,
  typeIntoFormFields
} from '@tests/__utils__/testUtils';
import { supabase } from './__mocks__/supabaseAuthHelpersMock';

describe('Forgot Password page', () => {
  it('should be accessible from Sign In page', async () => {
    await renderServerComponent(<SignIn />);
    expect(
      screen.getByRole('link', { name: 'Forgot Password?' })
    ).toBeInTheDocument();
  });

  it('should require all form fields to be populated', async () => {
    await renderServerComponent(<ForgotPassword />);
    await userEvent.click(screen.getByRole('button', { name: 'Send Email' }));
    expect(screen.getByLabelText('Email')).toHaveProperty(
      'validity.valueMissing',
      true
    );
  });

  it('should require valid email address', async () => {
    await renderServerComponent(<ForgotPassword />);
    await typeIntoFormFields({
      Email: 'notanemail'
    });
    expect(screen.getByLabelText('Email')).toHaveProperty(
      'validity.typeMismatch',
      true
    );
  });

  it('should call Supabase API correctly on server', async () => {
    jest
      .spyOn(supabase.auth, 'resetPasswordForEmail')
      .mockImplementationOnce(async () => {
        return { data: { user: {}, session: {} }, error: null } as any;
      });
    const fields = {
      email: 'caleb@calebevans.me',
      'cf-turnstile-response': 'abc123'
    };
    await callRouteHandler({
      handler: RequestPasswordResetPOST,
      path: '/auth/request-password-reset',
      fields
    });
    expect(supabase.auth.resetPasswordForEmail).toHaveBeenCalledWith(
      fields.email,
      {
        captchaToken: fields['cf-turnstile-response'],
        redirectTo: 'http://localhost:3000/reset-password'
      }
    );
  });
});
