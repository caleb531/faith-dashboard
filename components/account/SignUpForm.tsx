/* eslint-disable react/no-unescaped-entities */
import React from 'react';

type Props = {
  onSubmit: (event: React.FormEvent) => void
}

function SignUpForm({ onSubmit }: Props) {
  return (
    <form className="account-auth-form sign-up-form" onSubmit={onSubmit}>
      <label htmlFor="sign-up-form-email" className="accessibility-only">Email</label>
      <input
        className="account-auth-form-input sign-up-form-email"
        type="email"
        id="sign-up-form-email"
        name="email"
        placeholder="Email"
        autoFocus
        />
      <button type="submit" className="account-auth-form-submit sign-up-form-submit">Submit</button>
    </form>
  );
}

export default SignUpForm;
