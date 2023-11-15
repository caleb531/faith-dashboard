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
import { mockCaptchaSuccess } from './__mocks__/captchaMockUtils';
import { supabase } from './__mocks__/supabaseAuthHelpersMock';

describe('Forgot Password page', () => {
  it('should be accessible from Sign In page', async () => {
    mockCaptchaSuccess('mytoken');
    await renderServerComponent(<SignIn />);
    expect(
      await screen.findByRole('link', { name: 'Forgot Password?' })
    ).toBeInTheDocument();
  });

  it('should require all form fields to be populated', async () => {
    mockCaptchaSuccess('mytoken');
    await renderServerComponent(<ForgotPassword />);
    await userEvent.click(
      await screen.findByRole('button', { name: 'Send Email' })
    );
    expect(await screen.findByLabelText('Email')).toHaveProperty(
      'validity.valueMissing',
      true
    );
  });

  it('should require valid email address', async () => {
    mockCaptchaSuccess('mytoken');
    await renderServerComponent(<ForgotPassword />);
    await typeIntoFormFields({
      Email: 'notanemail'
    });
    expect(await screen.findByLabelText('Email')).toHaveProperty(
      'validity.typeMismatch',
      true
    );
  });

  it('should request password reset on server side', async () => {
    mockCaptchaSuccess('mytoken');
    vi.spyOn(supabase.auth, 'resetPasswordForEmail').mockImplementationOnce(
      async () => {
        return { data: { user: {}, session: {} }, error: null } as any;
      }
    );
    const fields = {
      email: 'caleb@example.com',
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
