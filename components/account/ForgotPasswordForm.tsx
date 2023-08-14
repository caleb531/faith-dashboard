'use client';
import AuthForm from '@components/account/AuthForm';
import AuthFormField from '@components/account/AuthFormField';
import serializeForm from '@components/account/serializeForm';
import useAutoFocus from '@components/account/useAutoFocus';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import React from 'react';

function ForgotPasswordForm() {
  const supabase = createClientComponentClient();
  const emailAutoFocusProps = useAutoFocus<HTMLInputElement>();

  function sendPasswordRecoveryEmail(event: React.FormEvent<HTMLFormElement>) {
    const fields = serializeForm(event.currentTarget);
    return supabase.auth.resetPasswordForEmail(fields.email);
  }

  return (
    <AuthForm
      onSubmit={sendPasswordRecoveryEmail}
      submitLabel="Send Email"
      submittingLabel="Sending..."
      successLabel="Almost done! Check your email to finish resetting"
    >
      <AuthFormField
        type="email"
        id="forgot-password-form-email"
        name="email"
        placeholder="Email"
        required
        {...emailAutoFocusProps}
      />
    </AuthForm>
  );
}

export default ForgotPasswordForm;
