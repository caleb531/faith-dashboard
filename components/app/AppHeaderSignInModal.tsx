import React, { useState } from 'react';
import Modal from '../generic/Modal';
import { supabase } from '../supabaseClient';

type Props = {
  onCloseSignInModal: () => void
};

function AppHeaderSignInModal({
  onCloseSignInModal
}: Props) {
  const [isFormShowing, setIsFormShowing] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  function showSignInForm() {
    setIsFormShowing(true);
  }
  function submitForm(event: React.FormEvent) {
    event.preventDefault();
    const formElement = event.currentTarget as HTMLFormElement;
    const emailInput = formElement.elements.namedItem('email') as HTMLInputElement;
    supabase.auth.signIn({ email: emailInput.value });
    setIsFormSubmitted(true);
  }
  return (
    <Modal onCloseModal={onCloseSignInModal}>
      <section className="sign-in">
        <h1>Account</h1>
        <p>Create a Faith Dashboard account to sync your dashboard and gain other features!</p>
        {isFormShowing ? (
          <form className="sign-in-form" onSubmit={submitForm}>
            <input
              className="sign-in-form-email"
              type="email"
              name="email"
              placeholder="Your email address"
              autoFocus
              />
              <button type="submit" className="sign-in-submit">Submit</button>
          </form>
        ) : (
          <div className="sign-in-cta-container">
            {/* Signing in with a new email address is the same as signing up */}
            <button className="sign-in-cta" onClick={showSignInForm}>Sign Up</button>
            <button className="sign-in-cta" onClick={showSignInForm}>Sign In</button>
          </div>
        )}
      </section>
    </Modal>
  );
}

export default AppHeaderSignInModal;
