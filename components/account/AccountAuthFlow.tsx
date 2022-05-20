/* eslint-disable react/no-unescaped-entities */
import type { ApiError } from '@supabase/supabase-js';
import React, { useState } from 'react';
import Modal from '../generic/Modal';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';

type Props = {
  onCloseModal: () => void
};

// The possible steps in the account authentication flow
type FlowStep = 'start' | 'sign-up' | 'sign-in' | 'form-submitted';

function AccountAuthFlow({
  onCloseModal
}: Props) {
  const [currentFlowStep, setCurrentFlowStep] = useState<FlowStep>('start');
  const [formError, setFormError] = useState<string>();

  function submitForm(event: React.FormEvent, error: ApiError | null) {
    if (error) {
      setFormError(error.message);
    } else {
      setCurrentFlowStep('form-submitted');
    }
  }

  function canGoBack() {
    return currentFlowStep === 'sign-up' || currentFlowStep === 'sign-in';
  }

  function goBack() {
    setCurrentFlowStep('start');
  }

  return (
    <Modal onCloseModal={onCloseModal} onBackButton={canGoBack() ? goBack : null}>
      <section className="account-auth-flow">
        {currentFlowStep === 'sign-up' ? (
          <div className="account-auth-flow-sign-up">
            <h1>Sign Up</h1>
            <p>By signing up with Faith Dashboard, you'll be able to sync your settings and widgets across all your devices!</p>
            <SignUpForm onSubmit={submitForm} />
          </div>
        ) : currentFlowStep === 'sign-in' ? (
          <div className="account-auth-flow-sign-in">
            <h1>Sign In</h1>
            <p>Sign in using just your email address; you will be emailed a link to finish the sign-in process.</p>
            <SignInForm onSubmit={submitForm} />
          </div>
        ) : currentFlowStep === 'form-submitted' ? (
          <div className="account-auth-flow-form-submitted">
            <h1>Almost Done!</h1>
            <p>Thank you! Please check your email for a magic link to automatically finish signing you in.</p>
          </div>
        ) : (
          <div className="account-auth-flow-start">
            <h1>Account</h1>
            <p>Create a Faith Dashboard account to sync your dashboard and gain other features!</p>
            <div className="account-auth-flow-cta-container">
              {/* Signing in with a new email address is the same as signing up */}
              <button
                className="account-auth-flow-cta"
                onClick={() => setCurrentFlowStep('sign-up')}>
                Sign Up
              </button>
              <button
                className="account-auth-flow-cta"
                onClick={() => setCurrentFlowStep('sign-in')}>
                Sign In
              </button>
            </div>
          </div>
        )}
      </section>
    </Modal>
  );
}

export default AccountAuthFlow;
