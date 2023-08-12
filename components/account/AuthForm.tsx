import { User } from '@supabase/supabase-js';
import Link from 'next/link';
import React, { useRef, useState } from 'react';
import { JSXChildren } from '../global.types';
import LoadingIndicator from '../reusable/LoadingIndicator';
import useAllSearchParams from '../useAllSearchParams';
import useMountListener from '../useMountListener';
import useTimeout from '../useTimeout';
import useUniqueFieldId from '../useUniqueFieldId';
import AuthFormField from './AuthFormField';

// The number of milliseconds to show the success label of the Submit button
// before reverting to the initial Submit button label
const successLabelDuration = 2000;

type Props = {
  action?: string;
  method?: 'GET' | 'POST' | 'get' | 'post';
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => Promise<{
    data: {
      user?: User | null;
    } | null;
    error: Error | null;
  }>;
  onSuccess?: ({ user }: { user?: User | null }) => boolean | void;
  submitLabel: string;
  submittingLabel: string;
  successLabel: string;
  altLink?: {
    title: string;
    href: string;
  };
  children: JSXChildren;
};

function AuthForm(props: Props) {
  const params = useAllSearchParams();
  const [formErrorMessage, setFormErrorMessage] = useState<
    string | null | undefined
  >(params.error ?? null);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const [isFormSuccess, setIsFormSuccess] = useState(false);
  const setSubmitLabelTimeout = useTimeout();
  const honeyPotFieldRef = useRef<HTMLInputElement>(null);

  async function attemptSubmit(event: React.FormEvent<HTMLFormElement>) {
    if (!props.onSubmit) {
      return;
    }
    const { data, error } = await props.onSubmit(event);
    const user = data?.user;
    // If there is no error, the value is conveniently null
    setFormErrorMessage(error?.message);
    if (error) {
      // Only stop showing "Submitting..." message if the authentication failed
      // somehow
      setIsFormSubmitting(false);
      return;
    }
    const successCallbackResult = props.onSuccess
      ? props.onSuccess({ user })
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
    if (!props.action) {
      event.preventDefault();
    }
    setIsFormSubmitting(true);
    setFormErrorMessage(null);
    try {
      if (honeyPotFieldRef.current && honeyPotFieldRef.current.value) {
        setFormErrorMessage('Cannot submit form; please try again');
        setIsFormSubmitting(false);
        return;
      }
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

  const honeyPotFieldId = useUniqueFieldId('verification-check');
  const isMounted = useMountListener();
  return isMounted ? (
    <form
      className="account-auth-form"
      onSubmit={onSubmitWrapper}
      action={props.action}
      method={props.method ?? 'POST'}
    >
      {props.children}
      {/* A "honey pot" field which must remain blank to prove the user is human */}
      <AuthFormField
        type="text"
        id={honeyPotFieldId}
        name="verification_check"
        placeholder="Please leave this field blank"
        ref={honeyPotFieldRef}
      />

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
          <Link
            href={props.altLink.href}
            className="account-auth-form-alt-link"
          >
            {props.altLink.title}
          </Link>
        ) : null}
      </div>
    </form>
  ) : (
    <LoadingIndicator />
  );
}

// Redirect to the main app if the user has been properly authenticated with a
// session; the "Submitting..." button label will continue showing while the
// browser is in the process of redirecting
export function redirectToHome() {
  window.location.assign('/');
  // By returning false, we can disable the resetting of the Submit button label
  return false;
}

export default AuthForm;
