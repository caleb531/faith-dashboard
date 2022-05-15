import React, { useState } from 'react';
import Modal from '../generic/Modal';

type Props = {
  onCloseSignInModal: () => void
};

function AppHeaderSignInModal({
  onCloseSignInModal
}: Props) {
  const [isFormShowing, setIsFormShowing] = useState(false);
  function showSignInForm() {
    setIsFormShowing(true);
  }
  return (
    <Modal onCloseModal={onCloseSignInModal}>
      <section className="sign-in">
        <h1>Account</h1>
        <p>Create a Faith Dashboard account to sync your dashboard and gain other features!</p>
        {isFormShowing ? (
          <form className="sign-in-form">
            <input type="text" name="email" />
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
