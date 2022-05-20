/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import { supabase } from '../supabaseClient';
import useFormSerializer from './useFormSerializer';

type Props = {
  onSubmit: (event: React.FormEvent) => void
}

function SignInForm({ onSubmit }: Props) {

  const [serializeForm] = useFormSerializer();

  async function signIn(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fields = serializeForm(event.currentTarget);
    await supabase.auth.signIn({
      email: fields.email,
      password: fields.password
    });
    onSubmit(event);
  }

  return (
    <form className="account-auth-form sign-in-form" onSubmit={signIn}>
      <label htmlFor="sign-in-form-email" className="accessibility-only">Email</label>
      <input
        className="account-auth-form-input"
        type="email"
        id="sign-in-form-email"
        name="email"
        placeholder="Email"
        required
        autoFocus
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
  );
}

export default SignInForm;
