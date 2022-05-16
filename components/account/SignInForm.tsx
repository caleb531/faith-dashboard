/* eslint-disable react/no-unescaped-entities */
import React from 'react';

type Props = {
  onSubmit: (event: React.FormEvent) => void
}

function SignInForm({ onSubmit }: Props) {
  return (
    <form className="account-auth-form sign-in-form" onSubmit={onSubmit}>
      <label htmlFor="sign-in-form-email" className="accessibility-only">Email</label>
      <input
        className="account-auth-form-input sign-in-form-email"
        type="email"
        id="sign-in-form-email"
        name="email"
        placeholder="Email"
        autoFocus
        />
      <button type="submit" className="account-auth-form-submit sign-in-form-submit">Submit</button>
    </form>
  );
}

export default SignInForm;
