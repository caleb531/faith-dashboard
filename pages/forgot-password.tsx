/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import AuthForm from '../components/account/AuthForm';
import AuthFormField from '../components/account/AuthFormField';
import serializeForm from '../components/account/serializeForm';
import useAutoFocus from '../components/account/useAutoFocus';
import LandingPage from '../components/LandingPage';
import { supabase } from '../components/supabaseClient';

function ForgotPassword() {
  const emailAutoFocusProps = useAutoFocus<HTMLInputElement>();

  function sendPasswordRecoveryEmail(event: React.FormEvent<HTMLFormElement>) {
    const fields = serializeForm(event.currentTarget);
    return supabase.auth.api.resetPasswordForEmail(fields.email);
  }

  return (
    <LandingPage
      heading="Forgot Password | Faith Dashboard"
      altLink={{ title: 'Sign In', href: '/sign-in' }}
    >
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
    </LandingPage>
  );
}

/* istanbul ignore next */
export async function getStaticProps() {
  return {
    props: {
      pagePath: '/forgot-password',
      pageTitle: 'Forgot Password | Faith Dashboard',
      pageDescription:
        'Start the process to reset your account password for Faith Dashboard, your home for strength and encouragement every day.'
    }
  };
}

export default ForgotPassword;
