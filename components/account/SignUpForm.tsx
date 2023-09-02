'use client';
import AuthForm from '@components/account/AuthForm';
import AuthFormField from '@components/account/AuthFormField';
import useAutoFocus from '@components/account/useAutoFocus';
import InlineMessage from '@components/reusable/InlineMessage';
import useFormFieldMatcher from '@components/useFormFieldMatcher';
import { AuthResponse, AuthUser } from '@supabase/supabase-js';
import { useState } from 'react';

function SignUpForm() {
  const [passwordFieldProps, confirmPasswordFieldProps] = useFormFieldMatcher({
    mismatchMessage: 'Passwords must match'
  });
  const firstNameAutoFocusProps = useAutoFocus<HTMLInputElement>();
  const [emailConfirmMessage, setEmailConfirmMessage] = useState<string | null>(
    null
  );

  function handleSignUpSuccess(response: AuthResponse) {
    const user: AuthUser | {} = response?.data?.user ?? {};
    if ('confirmation_sent_at' in user && !('confirmed_at' in user)) {
      setEmailConfirmMessage(
        'Success! Please check your email to complete your registration'
      );
    }
  }

  return (
    <>
      <AuthForm
        action="/auth/sign-up"
        onSuccess={handleSignUpSuccess}
        submitLabel="Sign Up"
        submittingLabel="Submitting..."
        successLabel="Success!"
        persistSuccessState
        requireCaptcha
      >
        <AuthFormField
          type="text"
          id="sign-up-form-first-name"
          name="first_name"
          placeholder="First Name"
          required
          autoComplete="on"
          {...firstNameAutoFocusProps}
        />
        <AuthFormField
          type="text"
          id="sign-up-form-last-name"
          name="last_name"
          placeholder="Last Name"
          required
          autoComplete="on"
        />
        <AuthFormField
          type="email"
          id="sign-up-form-email"
          name="email"
          placeholder="Email"
          required
          autoComplete="on"
        />
        <AuthFormField
          type="password"
          id="sign-up-form-password"
          name="password"
          placeholder="Password"
          required
          {...passwordFieldProps}
        />
        <AuthFormField
          type="password"
          id="sign-up-form-confirm-password"
          name="confirm_password"
          placeholder="Confirm Password"
          required
          {...confirmPasswordFieldProps}
        />
      </AuthForm>
      {emailConfirmMessage ? (
        <InlineMessage type="success" message={emailConfirmMessage} />
      ) : null}
    </>
  );
}

export default SignUpForm;
