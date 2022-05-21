/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import useAutoFocus from '../components/account/useAutoFocus';
import useFormSerializer from '../components/account/useFormSerializer';
import LandingPage from '../components/LandingPage';
import { supabase } from '../components/supabaseClient';
import useLandingPage from '../components/useLandingPage';

type Props = {
  pageTitle: string
};

function SignUpForm({ pageTitle }: Props) {

  useLandingPage();

  const [serializeForm] = useFormSerializer();
  const emailAutoFocus = useAutoFocus<HTMLInputElement>();

  async function signIn(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fields = serializeForm(event.currentTarget);
    const { user, session, error } = await supabase.auth.signIn({
      email: fields.email,
      password: fields.password
    });
    console.log('user', user);
    console.log('session', session);
    console.log('error', error);
  }

  return (
    <LandingPage heading={pageTitle} altLink={{ title: 'Sign Up', href: 'sign-up' }}>
      <p>Sign in using just your email address; you will be emailed a link to finish the sign-in process.</p>
      <form className="account-auth-form sign-in-form" onSubmit={signIn}>
        <label htmlFor="sign-in-form-email" className="accessibility-only">Email</label>
        <input
          className="account-auth-form-input"
          type="email"
          id="sign-in-form-email"
          name="email"
          placeholder="Email"
          required
          {...emailAutoFocus}
          />
        <label htmlFor="sign-in-form-password" className="accessibility-only">Password</label>
        <input
          className="account-auth-form-input"
          type="password"
          id="sign-in-form-password"
          name="password"
          placeholder="Password"
          required
          />
        <button type="submit" className="account-auth-form-submit sign-in-form-submit">Submit</button>
      </form>
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
