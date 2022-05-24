/* eslint-disable react/no-unescaped-entities */
import { omit } from 'lodash-es';
import React, { useRef } from 'react';
import AuthForm from '../components/account/AuthForm';
import useAutoFocus from '../components/account/useAutoFocus';
import useFormSerializer from '../components/account/useFormSerializer';
import useApp from '../components/app/useApp';
import LandingPage from '../components/LandingPage';
import { supabase } from '../components/supabaseClient';

type Props = {
  pageTitle: string
};

function SignUpForm({ pageTitle }: Props) {

  useApp();

  const [serializeForm] = useFormSerializer();
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const firstNameAutoFocus = useAutoFocus<HTMLInputElement>();

  function signUp(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fields = serializeForm(event.currentTarget);
    return supabase.auth.signUp({
      email: fields.email,
      password: fields.password
    }, {
      data: omit(fields, ['email', 'password', 'confirm_password'])
    });
  }

  function checkIfPasswordsMatch(event: React.FormEvent<HTMLInputElement>) {
    const confirmPasswordInput = event.currentTarget as HTMLInputElement;
    const firstPasswordInput = passwordInputRef.current;
    if (confirmPasswordInput.value !== firstPasswordInput?.value) {
      confirmPasswordInput.setCustomValidity('Passwords must match');
    } else {
      confirmPasswordInput.setCustomValidity('');
    }
  }

  return (
    <LandingPage heading={pageTitle} altLink={{ title: 'Sign In', href: 'sign-in' }}>
      <p>By signing up with Faith Dashboard, you'll be able to sync your settings and widgets across all your devices.</p>
      <AuthForm
        onSubmit={signUp}
        submitLabel="Sign Up"
        submittingLabel="Submitting..."
        successLabel="Success! Redirecting...">
        <label htmlFor="sign-up-form-first-name" className="accessibility-only">First Name</label>
        <input
          className="account-auth-form-input"
          type="text"
          id="sign-up-form-first-name"
          name="first_name"
          placeholder="First Name"
          required
          {...firstNameAutoFocus}
          />
        <label htmlFor="sign-up-form-last-name" className="accessibility-only">Last Name</label>
        <input
          className="account-auth-form-input"
          type="text"
          id="sign-up-form-last-name"
          name="last_name"
          placeholder="Last Name"
          required
          />
        <label htmlFor="sign-up-form-first-name" className="accessibility-only">Email</label>
        <input
          className="account-auth-form-input"
          type="email"
          id="sign-up-form-email"
          name="email"
          placeholder="Email"
          required
          />
        <label htmlFor="sign-in-form-password" className="accessibility-only">Password</label>
        <input
          className="account-auth-form-input"
          type="password"
          id="sign-up-form-password"
          name="password"
          placeholder="Password"
          required
          ref={passwordInputRef}
          />
        <label htmlFor="sign-up-form-confirm-password" className="accessibility-only">Confirm Password</label>
        <input
          className="account-auth-form-input"
          type="password"
          id="sign-up-form-confirm-password"
          name="confirm_password"
          placeholder="Confirm Password"
          required
          onChange={checkIfPasswordsMatch}
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
