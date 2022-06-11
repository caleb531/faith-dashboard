/* eslint-disable react/no-unescaped-entities */
import { omit } from 'lodash-es';
import React from 'react';
import AuthForm from '../components/account/AuthForm';
import AuthFormField from '../components/account/AuthFormField';
import serializeForm from '../components/account/serializeForm';
import useAutoFocus from '../components/account/useAutoFocus';
import useApp from '../components/app/useApp';
import LandingPage from '../components/LandingPage';
import { supabase } from '../components/supabaseClient';
import useFormFieldMatcher from '../components/useFormFieldMatcher';

type Props = {
  pageTitle: string
};

function SignUpForm({ pageTitle }: Props) {

  useApp();

  const [passwordFieldProps, confirmPasswordFieldProps] = useFormFieldMatcher({
    mismatchMessage: 'Passwords must match'
  });
  const [emailFieldProps, confirmEmailFieldProps] = useFormFieldMatcher({
    mismatchMessage: 'Emails must match'
  });
  const firstNameAutoFocusProps = useAutoFocus<HTMLInputElement>();

  function signUp(event: React.FormEvent<HTMLFormElement>) {
    const fields = serializeForm(event.currentTarget);
    return supabase.auth.signUp({
      email: fields.email,
      password: fields.password
    }, {
      data: omit(fields, ['email', 'password', 'confirm_password'])
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
    <LandingPage heading={pageTitle} altLink={{ title: 'Sign In', href: '/sign-in' }}>
      <p>By signing up with Faith Dashboard, you'll be able to sync your settings and widgets across all your devices.</p>
      <AuthForm
        onSubmit={signUp}
        onSuccess={redirectToHome}
        submitLabel="Sign Up"
        submittingLabel="Submitting..."
        successLabel="Success! Redirecting...">
        <AuthFormField
          className="account-auth-form-input"
          type="text"
          id="sign-up-form-first-name"
          name="first_name"
          placeholder="First Name"
          required
          {...firstNameAutoFocusProps}
          />
        <AuthFormField
          className="account-auth-form-input"
          type="text"
          id="sign-up-form-last-name"
          name="last_name"
          placeholder="Last Name"
          required
          />
        <AuthFormField
          className="account-auth-form-input"
          type="email"
          id="sign-up-form-email"
          name="email"
          placeholder="Email"
          required
          {...emailFieldProps}
          />
        <AuthFormField
          className="account-auth-form-input"
          type="email"
          id="sign-up-form-confirm-email"
          name="confirm_email"
          placeholder="Confirm Email"
          required
          {...confirmEmailFieldProps}
          />
        <AuthFormField
          className="account-auth-form-input"
          type="password"
          id="sign-up-form-password"
          name="password"
          placeholder="Password"
          required
          {...passwordFieldProps}
          />
        <AuthFormField
          className="account-auth-form-input"
          type="password"
          id="sign-up-form-confirm-password"
          name="confirm_password"
          placeholder="Confirm Password"
          required
          {...confirmPasswordFieldProps}
          />
      </AuthForm>
    </LandingPage>
  );
}

export async function getStaticProps() {
  return {
    props: {
      pagePath: '/sign-up',
      pageTitle: 'Sign Up | Faith Dashboard',
      pageDescription: 'Sign up for Faith Dashboard, your one place for anything and everything that inspires your faith.'
    }
  };
}

export default SignUpForm;
