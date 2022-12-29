/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import AuthForm, { redirectToHome } from '../components/account/AuthForm';
import AuthFormField from '../components/account/AuthFormField';
import serializeForm from '../components/account/serializeForm';
import useAutoFocus from '../components/account/useAutoFocus';
import LandingPage from '../components/LandingPage';
import { supabase } from '../components/supabaseClient';

function SignInForm() {
  const emailAutoFocusProps = useAutoFocus<HTMLInputElement>();

  function signIn(event: React.FormEvent<HTMLFormElement>) {
    const fields = serializeForm(event.currentTarget);
    return supabase.auth.signInWithPassword({
      email: fields.email,
      password: fields.password
    });
  }

  return (
    <LandingPage
      heading="Sign In | Faith Dashboard"
      altLink={{ title: 'Sign Up', href: '/sign-up' }}
    >
      <p>
        Sign in below to sync your settings and widgets across all your devices.
      </p>
      <AuthForm
        onSubmit={signIn}
        onSuccess={redirectToHome}
        submitLabel="Sign In"
        submittingLabel="Submitting..."
        successLabel="Success! Redirecting..."
        altLink={{ title: 'Forgot Password?', href: '/forgot-password' }}
      >
        <AuthFormField
          type="email"
          id="sign-in-form-email"
          name="email"
          placeholder="Email"
          required
          {...emailAutoFocusProps}
        />
        <AuthFormField
          type="password"
          id="sign-in-form-password"
          name="password"
          placeholder="Password"
          required
        />
      </AuthForm>
    </LandingPage>
  );
}

/* istanbul ignore next */
export async function getServerSideProps() {
  return {
    props: {
      pagePath: '/sign-in',
      pageTitle: 'Sign In | Faith Dashboard',
      pageDescription:
        'Sign into Faith Dashboard, your home for strength and encouragement every day.'
    }
  };
}

export default SignInForm;
