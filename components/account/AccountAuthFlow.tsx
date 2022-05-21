/* eslint-disable react/no-unescaped-entities */
import type { ApiError } from '@supabase/supabase-js';
import Link from 'next/link';
import React, { useState } from 'react';
import Modal from '../generic/Modal';

type Props = {
  onCloseModal: () => void
};

// The possible steps in the account authentication flow
type FlowStep = 'start' | 'sign-up' | 'sign-in' | 'form-submitted';

function AccountAuthFlow({
  onCloseModal
}: Props) {
  const [formError, setFormError] = useState<string>();

  function submitForm(event: React.FormEvent, error: ApiError | null) {
    if (error) {
      setFormError(error.message);
    }
  }

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
