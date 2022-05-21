/* eslint-disable react/no-unescaped-entities */
import type { ApiError } from '@supabase/supabase-js';
import { omit } from 'lodash-es';
import React, { useRef } from 'react';
import { supabase } from '../supabaseClient';
import useFormSerializer from './useFormSerializer';

type Props = {
  onSubmit: (event: React.FormEvent, error: ApiError | null) => void
}

function SignUpForm({ onSubmit }: Props) {

  const [serializeForm] = useFormSerializer();
  const passwordInputRef = useRef<HTMLInputElement>(null);

  async function signUp(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fields = serializeForm(event.currentTarget);
    const { user, session, error } = await supabase.auth.signUp({
      email: fields.email,
      password: fields.password
    }, {
      data: omit(fields, ['email', 'password', 'confirm_password'])
    });
    console.log('user', user);
    console.log('session', session);
    console.log('error', error);
    onSubmit(event, error);
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
    <form className="account-auth-form sign-up-form" onSubmit={signUp}>
      <h1>Sign Up</h1>
      <p>By signing up with Faith Dashboard, you'll be able to sync your settings and widgets across all your devices!</p>
      <label htmlFor="sign-up-form-first-name" className="accessibility-only">First Name</label>
      <input
        className="account-auth-form-input"
        type="text"
        id="sign-up-form-first-name"
        name="first-name"
        placeholder="First Name"
        required
        autoFocus
        />
      <label htmlFor="sign-up-form-last-name" className="accessibility-only">Last Name</label>
      <input
        className="account-auth-form-input"
        type="text"
        id="sign-up-form-last-name"
        name="last-name"
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
      <button type="submit" className="account-auth-form-submit sign-up-form-submit">Submit</button>
    </form>
  );
}

export default SignUpForm;
