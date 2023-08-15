import { User } from '@supabase/supabase-js';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import useAllSearchParams from '../useAllSearchParams';
import useTimeout from '../useTimeout';
import useUniqueFieldId from '../useUniqueFieldId';
import AuthFormField from './AuthFormField';

// The number of milliseconds to show the success label of the Submit button
// before reverting to the initial Submit button label
const successLabelDuration = 2000;
// The default HTTP method to use for form submission
const defaultHttpMethod = 'POST';

type Props = {
  action?: string;
  useAjax?: boolean;
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
  children: React.ReactNode;
};

function AuthForm(props: Props) {
  const params = useAllSearchParams();
  const [formErrorMessage, setFormErrorMessage] = useState<
    string | null | undefined
  >(null);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const [isFormSuccess, setIsFormSuccess] = useState(false);
  const setSubmitLabelTimeout = useTimeout();
  const honeyPotFieldRef = useRef<HTMLInputElement>(null);

  async function submitFormViaHandler(event: React.FormEvent<HTMLFormElement>) {
    let response;
    if (props.action && props.useAjax) {
      response = await (
        await fetch(props.action, {
          method: props.method ?? defaultHttpMethod,
          body: new FormData(event.currentTarget)
        })
      ).json();
    } else if (props.onSubmit) {
      response = await props.onSubmit(event);
    } else {
      return;
    }
    const user = response.data?.user;
    // If there is no error, the value is conveniently null
    setFormErrorMessage(response.error?.message);
    if (response.error) {
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

  async function prepareForSubmit(event: React.FormEvent<HTMLFormElement>) {
    if (!props.action || props.useAjax) {
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
      // submitForm() call to properly catch any errors, because
      // submitForm() is an async function and would otherwise run
      // asynchronously outside of the try..catch statement's control
      await submitFormViaHandler(event);
    } catch (error: any) {
      setFormErrorMessage(error?.toString());
      setIsFormSubmitting(false);
    }
  }

  // To prevent hydration mismatches, we must grab the error message from the
  // URL via useEffect
  useEffect(() => {
    setFormErrorMessage(params.error ?? null);
  }, [params.error]);

  const honeyPotFieldId = useUniqueFieldId('verification-check');

  return (
    <form
      className="account-auth-form"
      onSubmit={prepareForSubmit}
      action={props.action}
      method={props.method ?? defaultHttpMethod}
    >
      {props.children}
      {/* A "honey pot" field which must remain blank to prove the user is human */}
      <AuthFormField
        type="text"
        id={honeyPotFieldId}
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
