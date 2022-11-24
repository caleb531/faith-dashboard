/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import AuthForm from '../components/account/AuthForm';
import AuthFormField from '../components/account/AuthFormField';
import serializeForm from '../components/account/serializeForm';
import LandingPage from '../components/LandingPage';
import { supabase } from '../components/supabaseClient';
import useFormFieldMatcher from '../components/useFormFieldMatcher';

function ResetPassword() {
  const [passwordFieldProps, confirmPasswordFieldProps] = useFormFieldMatcher({
    mismatchMessage: 'Passwords must match'
  });

  function resetPassword(event: React.FormEvent<HTMLFormElement>) {
    const fields = serializeForm(event.currentTarget);
    return supabase.auth.updateUser({ password: fields.new_password });
  }

  function redirectToHome() {
    // Redirect to the main app if the user has been properly authenticated
    // with a session; the "Submitting..." button label will continue showing
    // while the browser is in the process of redirecting
    window.location.assign('/');
    // By returning false, we can disable the resetting of the Submit button
    // label
    return false;
  }

  return (
    <LandingPage
      heading="Reset Password | Faith Dashboard"
      altLink={{ title: 'Sign In', href: '/sign-in' }}
    >
      <AuthForm
        onSubmit={resetPassword}
        onSuccess={redirectToHome}
        submitLabel="Reset Password"
        submittingLabel="Resetting..."
        successLabel="Success! Redirecting..."
      >
        <AuthFormField
          type="password"
          id="reset-password-form-new-password"
          name="new_password"
          placeholder="New Password"
          required
          {...passwordFieldProps}
        />
        <AuthFormField
          type="password"
          id="reset-password-form-confirm-new-password"
          name="confirm_new_password"
          placeholder="Confirm New Password"
          required
          {...confirmPasswordFieldProps}
        />
      </AuthForm>
    </LandingPage>
  );
}

/* istanbul ignore next */
export async function getStaticProps() {
  return {
    props: {
      pagePath: '/reset-password',
      pageTitle: 'Reset Password | Faith Dashboard',
      pageDescription:
        'Reset your account password for Faith Dashboard, your home for strength and encouragement every day.'
    }
  };
}

export default ResetPassword;
