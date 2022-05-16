import React, { useState } from 'react';
import Modal from '../generic/Modal';

type Props = {
  onCloseModal: () => void
};

function AppHeaderAuthFlow({
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
        <h1>Account</h1>
        <p>Create a Faith Dashboard account to sync your dashboard and gain other features!</p>
        {isFormShowing ? (
          <form className="account-auth-flow-form" onSubmit={submitForm}>
            <label htmlFor="account-auth-flow-email">Email</label>
            <input
              className="account-auth-flow-form-email"
              type="email"
              id="account-auth-flow-email"
              name="email"
              placeholder="me@somewebsite.com"
              autoFocus
              />
              <button type="submit" className="account-auth-flow-submit">Submit</button>
          </form>
        ) : (
          <div className="account-auth-flow-cta-container">
            {/* Signing in with a new email address is the same as signing up */}
            <button className="account-auth-flow-cta" onClick={showAuthForm}>Sign Up</button>
            <button className="account-auth-flow-cta" onClick={showAuthForm}>Sign In</button>
          </div>
        )}
      </section>
    </Modal>
  );
}

export default AppHeaderAuthFlow;
