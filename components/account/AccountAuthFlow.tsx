/* eslint-disable react/no-unescaped-entities */
import React, { useState } from 'react';
import Modal from '../generic/Modal';
import SignUpForm from './SignUpForm';

type Props = {
  onCloseModal: () => void
};

function AccountAuthFlow({
  onCloseModal
}: Props) {
  const [isFormShowing, setIsFormShowing] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  function showAuthForm() {
    setIsFormShowing(true);
  }
  function submitForm(event: React.FormEvent) {
    event.preventDefault();
    const formElement = event.currentTarget as HTMLFormElement;
    const emailInput = formElement.elements.namedItem('email') as HTMLInputElement;
    // TODO: re-enable this after testing
    // supabase.auth.signIn({ email: emailInput.value });
    setIsFormSubmitted(true);
  }
  return (
    <Modal onCloseModal={onCloseModal}>
      <section className="account-auth-flow">
        {isFormShowing ? (
          <div className="account-auth-flow-sign-up">
            <h1>Sign Up</h1>
            <p>By signing up with Faith Dashboard, you'll be able to sync your settings and widgets across all your devices!</p>
            <SignUpForm onSubmit={submitForm} />
          </div>
        ) : (
          <div className="account-auth-flow-start">
            <h1>Account</h1>
            <p>Create a Faith Dashboard account to sync your dashboard and gain other features!</p>
            <div className="account-auth-flow-cta-container">
              {/* Signing in with a new email address is the same as signing up */}
              <button className="account-auth-flow-cta" onClick={showAuthForm}>Sign Up</button>
              <button className="account-auth-flow-cta" onClick={showAuthForm}>Sign In</button>
            </div>
          </div>
        )}
      </section>
    </Modal>
  );
}

export default AccountAuthFlow;
