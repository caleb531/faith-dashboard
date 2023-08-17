'use client';
import AuthForm from '@components/account/AuthForm';
import AuthFormField from '@components/account/AuthFormField';
import serializeForm from '@components/account/serializeForm';
import SessionContext from '@components/app/SessionContext';
import LoadingIndicator from '@components/reusable/LoadingIndicator';
import useFormFieldMatcher from '@components/useFormFieldMatcher';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import React, { useContext } from 'react';

function ResetPasswordForm() {
  const supabase = createClientComponentClient();
  const { session } = useContext(SessionContext);
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

  return session ? (
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
  ) : (
    <LoadingIndicator />
  );
}

export default ResetPasswordForm;
