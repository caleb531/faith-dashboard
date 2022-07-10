import { ApiError, Session, User } from '@supabase/supabase-js';
import Link from 'next/link';
import React, { useState } from 'react';
import { JSXContents } from '../global';
import useTimeout from '../useTimeout';

// The number of milliseconds to show the success label of the Submit button
// before reverting to the initial Submit button label
const successLabelDuration = 2000;

type Props = {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<{
    user?: User | null;
    session?: Session | null;
    error: ApiError | null;
  }>;
  onSuccess?: ({
    user,
    session
  }: {
    user?: User | null;
    session?: Session | null;
  }) => boolean | void;
  submitLabel: string;
  submittingLabel: string;
  successLabel: string;
  altLink?: {
    title: string;
    href: string;
  };
  children: JSXContents;
};

function AuthForm(props: Props) {
  const [formErrorMessage, setFormErrorMessage] = useState<string | null>();
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const [isFormSuccess, setIsFormSuccess] = useState(false);
  const setSubmitLabelTimeout = useTimeout();

  async function attemptSubmit(event: React.FormEvent<HTMLFormElement>) {
    const { user, session, error } = await props.onSubmit(event);
    // If there is no error, the value is conveniently null
    setFormErrorMessage(error?.message);
    if (error) {
      // Only stop showing "Submitting..." message if the authentication failed
      // somehow
      setIsFormSubmitting(false);
      return;
    }
    const successCallbackResult = props.onSuccess
      ? props.onSuccess({ user, session })
      : null;
    // If the onSuccess() callback returns false, the Submit button should not
    // revert to its initial label, but rather, remain in a "Submitting" state
    if (successCallbackResult !== false) {
      setIsFormSubmitting(false);
      setIsFormSuccess(true);
      // Reset the Submit button to its initial label after a few seconds of
      // showing the success label
      setSubmitLabelTimeout(() => {
        setIsFormSuccess(false);
      }, successLabelDuration);
    }
  }

  async function onSubmitWrapper(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsFormSubmitting(true);
    setFormErrorMessage(null);
    try {
      // Even though we are not capturing the return value, we must await the
      // attemptSubmit() call to properly catch any errors, because
      // attemptSubmit() is an async function and would otherwise run
      // asynchronously outside of the try..catch statement's control
      await attemptSubmit(event);
    } catch (error: any) {
      setFormErrorMessage(error?.toString());
      setIsFormSubmitting(false);
    }
  }

  return (
    <form className="account-auth-form" onSubmit={onSubmitWrapper}>
      {props.children}

      {formErrorMessage ? (
        <div className="account-auth-form-validation-area">
          <div className="account-auth-form-validation-message">
            {formErrorMessage}
          </div>
        </div>
      ) : null}

      <div className="account-auth-form-submit-container">
        <button
          type="submit"
          className="account-auth-form-submit"
          disabled={isFormSubmitting || isFormSuccess}
        >
          {isFormSubmitting && props.submittingLabel
            ? props.submittingLabel
            : isFormSuccess && props.successLabel
            ? props.successLabel
            : props.submitLabel}
        </button>
        {props.altLink ? (
          <Link href={props.altLink.href}>
            <a className="account-auth-form-alt-link">Forgot Password?</a>
          </Link>
        ) : null}
      </div>
    </form>
  );
}

export default AuthForm;
