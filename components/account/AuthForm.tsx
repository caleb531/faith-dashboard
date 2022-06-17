import { ApiError, Session, User } from '@supabase/supabase-js';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import Captcha from '../Captcha';
import useCaptcha from '../useCaptcha';

// The number of milliseconds to show the success label of the Submit button
// before reverting to the initial Submit button label
const successLabelDuration = 2000;

type Props = {
  onSubmit: (event: React.FormEvent<HTMLFormElement>, captchaToken?: string) => Promise<{
    user?: User | null,
    session?: Session | null,
    error: ApiError | null
  }>,
  onSuccess?: ({ user, session }: {
    user?: User | null,
    session?: Session | null
  }) => boolean | void,
  submitLabel: string,
  submittingLabel: string,
  successLabel: string,
  altLink?: {
    title: string,
    href: string
  },
  captchaEnabled?: boolean,
  children: JSX.Element | (JSX.Element | null)[] | null
};

function AuthForm(props: Props) {

  const [formError, setFormError] = useState<ApiError | null>();
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const [isFormSuccess, setIsFormSuccess] = useState(false);
  const [captchaRef, executeCaptcha] = useCaptcha();
  let submitLabelTimer: ReturnType<typeof setTimeout>;

  async function getCaptchaToken(): Promise<string> {
    let captchaToken;
    if (props.captchaEnabled) {
      captchaToken = (await executeCaptcha())?.response;
    } else {
      captchaToken = '';
    }
    return captchaToken;
  }

  async function onSubmitWrapper(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsFormSubmitting(true);
    setFormError(null);
    const { user, session, error } = await props.onSubmit(
      event,
      await getCaptchaToken()
    );
    console.log('user', user);
    console.log('session', session);
    console.log('error', error);
    // If there is no error, the value is conveniently null
    setFormError(error);
    if (error) {
      // Only stop showing "Submitting..." message if the authentication failed
      // somehow
      setIsFormSubmitting(false);
      return;
    }
    const successCallbackResult = props.onSuccess ?
      props.onSuccess({ user, session }) :
      null;
    // If the onSuccess() callback returns false, the Submit button should not
    // revert to its initial label, but rather, remain in a "Submitting" state
    if (successCallbackResult !== false) {
      setIsFormSubmitting(false);
      setIsFormSuccess(true);
      // Reset the Submit button to its initial label after a few seconds of
      // showing the success label
      submitLabelTimer = setTimeout(() => {
        setIsFormSuccess(false);
      }, successLabelDuration);
    }
  }

  // Clear the timeout when the AuthForm component unmounts to prevent the
  // "unmounted component" error from React
  useEffect(() => {
    return () => {
      clearTimeout(submitLabelTimer);
    };
  /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, []);

  return (
    <form className="account-auth-form" onSubmit={onSubmitWrapper}>

      {props.children}

      {props.captchaEnabled ? (
        <Captcha ref={captchaRef} />
      ) : null}

      {formError?.message ? (
        <div className="account-auth-form-validation-area">
          <div className="account-auth-form-validation-message">{formError.message}</div>
        </div>
      ) : null}

      <div className="account-auth-form-submit-container">
        <button
          type="submit"
          className="account-auth-form-submit"
          disabled={isFormSubmitting || isFormSuccess}>
          {isFormSubmitting && props.submittingLabel ?
            props.submittingLabel :
            isFormSuccess && props.successLabel ?
              props.successLabel :
              props.submitLabel}
        </button>
        {props.altLink ? (
          <Link href="/forgot-password"><a className="account-auth-form-alt-link">Forgot Password?</a></Link>
        ) : null}
      </div>

    </form>
  );
}

export default AuthForm;
