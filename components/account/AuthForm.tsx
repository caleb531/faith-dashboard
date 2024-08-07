import Captcha from '@components/Captcha';
import Button from '@components/reusable/Button';
import InlineMessage from '@components/reusable/InlineMessage';
import useVerifyCaptcha from '@components/useVerifyCaptcha';
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
// The number of milliseconds to wait between each check of the Captcha
// response's availability
const captchaRetryDelay = 500;
// The maximum number of attempts to check the Captcha response's availability
const captchaMaxAttempts = 5;

type Props = {
  action: string;
  method?: 'GET' | 'POST' | 'get' | 'post';
  onSuccess?: (response: any) => boolean | void | Promise<void>;
  submitLabel: string;
  submittingLabel: string;
  successLabel: string;
  persistSuccessState?: boolean;
  altLink?: {
    title: string;
    href: string;
  };
  requireCaptcha?: boolean;
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
  const [getCaptchaToken, setCaptchaToken] = useVerifyCaptcha();

  async function callActionEndpoint(
    action: string,
    formData: FormData
  ): Promise<any> {
    return (
      await fetch(action, {
        method: props.method ?? defaultHttpMethod,
        body: formData
      })
    ).json();
  }

  // Display error message if response contains error information, otherwise
  // reset the current error message in the case of success
  function synchronizeFormErrorState(response: any): void {
    // If there is no error, the value is conveniently null
    if (response?.error) {
      // This will be caught by the handlePreSubmit() function
      throw response.error;
    } else {
      setFormErrorMessage(null);
    }
  }

  function setFormStatePostSuccess(
    successCallbackResult: boolean | void | null
  ) {
    // If the onSuccess() callback returns false, the Submit button should not
    // revert to its initial label, but rather, remain in a "Submitting" state
    if (successCallbackResult === false) {
      return;
    }
    setIsFormSubmitting(false);
    setIsFormSuccess(true);
    // Reset the Submit button to its initial label after a few seconds of
    // showing the success label
    if (!props.persistSuccessState) {
      setSubmitLabelTimeout(() => {
        setIsFormSuccess(false);
      }, successLabelDuration);
    }
  }

  async function submitForm(
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> {
    const response = await callActionEndpoint(
      props.action,
      new FormData(event.target as HTMLFormElement)
    );
    synchronizeFormErrorState(response);
    const successCallbackResult = props.onSuccess
      ? await props.onSuccess(response)
      : null;
    setFormStatePostSuccess(successCallbackResult);
  }

  // Wait for the CAPTCHA response to be generated on the client-side, timing
  // out and erroring after
  async function waitForCaptcha(attemptNumber = 0) {
    if (!props.requireCaptcha || getCaptchaToken()) {
      return Promise.resolve();
    } else if (attemptNumber < captchaMaxAttempts) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(waitForCaptcha(attemptNumber + 1));
        }, captchaRetryDelay);
      });
    } else {
      throw new Error(
        'Sorry, something went wrong. Try submitting the form again.'
      );
    }
  }

  // When clicking the Submit button, immediately show the button label in a
  // "Submitting" state, verify the honeypot field, and try to call the
  // designated action endpoint
  async function handlePreSubmit(
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> {
    event.preventDefault();
    setIsFormSubmitting(true);
    setFormErrorMessage(null);
    try {
      if (honeyPotFieldRef.current && honeyPotFieldRef.current.value) {
        throw new Error('Cannot submit form; please try again');
      }
      await waitForCaptcha();
      await submitForm(event);
    } catch (error: any) {
      setFormErrorMessage(error?.message);
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
      onSubmit={handlePreSubmit}
      action={props.action}
      method={props.method ?? defaultHttpMethod}
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
        <InlineMessage type="error" message={formErrorMessage} />
      ) : null}

      <div className="account-auth-form-submit-container">
        <Button
          type="submit"
          className="account-auth-form-submit"
          disabled={isFormSubmitting || isFormSuccess}
        >
          {isFormSubmitting && props.submittingLabel
            ? props.submittingLabel
            : isFormSuccess && props.successLabel
            ? props.successLabel
            : props.submitLabel}
        </Button>
        {props.altLink ? (
          <Link
            href={props.altLink.href}
            className="account-auth-form-alt-link"
          >
            {props.altLink.title}
          </Link>
        ) : null}
      </div>
      {props.requireCaptcha ? (
        <Captcha setCaptchaToken={setCaptchaToken} />
      ) : null}
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
