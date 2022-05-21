/* eslint-disable react/no-unescaped-entities */
import Link from 'next/link';
import React from 'react';
import Modal from '../generic/Modal';

type Props = {
  onCloseModal: () => void
};

function AccountAuthFlow({
  onCloseModal
}: Props) {
  return (
    <Modal onCloseModal={onCloseModal}>
      <section className="account-auth-flow">
        <div className="account-auth-flow-start">
          <h1>Account</h1>
          <p>Create a Faith Dashboard account to sync your dashboard and gain other features!</p>
          <div className="account-auth-flow-cta-container">
            {/* Signing in with a new email address is the same as signing up */}
            <Link
              href="/sign-up">
              <a className="button account-auth-flow-cta">
                Sign Up
              </a>
            </Link>
            <Link
              href="/sign-in">
              <a className="button account-auth-flow-cta">
                Sign In
              </a>
            </Link>
          </div>
        </div>
      </section>
    </Modal>
  );
}

export default AccountAuthFlow;
