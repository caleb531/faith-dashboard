/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import AuthForm from '../components/account/AuthForm';
import AuthFormField from '../components/account/AuthFormField';
import serializeForm from '../components/account/serializeForm';
import useAutoFocus from '../components/account/useAutoFocus';
import useApp from '../components/app/useApp';
import LandingPage from '../components/LandingPage';
import { supabase } from '../components/supabaseClient';

type Props = {
  pageTitle: string
};

function SignUpForm({ pageTitle }: Props) {

  useApp();

  const emailAutoFocus = useAutoFocus<HTMLInputElement>();

  function signIn(event: React.FormEvent<HTMLFormElement>) {
    const fields = serializeForm(event.currentTarget);
    return supabase.auth.signIn({
      email: fields.email,
      password: fields.password
    });
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
    <LandingPage heading={pageTitle} altLink={{ title: 'Sign Up', href: 'sign-up' }}>
      <p>Sign in below to sync your settings and widgets across all your devices.</p>
      <AuthForm
        onSubmit={signIn}
        onSuccess={redirectToHome}
        submitLabel="Sign In"
        submittingLabel="Submitting..."
        successLabel="Success! Redirecting...">
        <AuthFormField
          className="account-auth-form-input"
          type="email"
          id="sign-in-form-email"
          name="email"
          placeholder="Email"
          required
          {...emailAutoFocus}
          />
        <AuthFormField
          className="account-auth-form-input"
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

export async function getStaticProps() {
  return {
    props: {
      pagePath: '/sign-in',
      pageTitle: 'Sign In | Faith Dashboard',
      pageDescription: 'Sign into Faith Dashboard, your one place for anything and everything that inspires your faith.'
    }
  };
}

export default SignUpForm;
