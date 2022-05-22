import { ApiError, Session, User } from '@supabase/supabase-js';
import React, { useState } from 'react';

type Props = {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<{
    user: User | null,
    session: Session | null,
    error: ApiError | null
  }>,
  submitLabel: string,
  submittingLabel: string,
  successLabel: string,
  children: JSX.Element | (JSX.Element | null)[] | null
};

function AuthForm(props: Props) {

  const [formError, setFormError] = useState<ApiError | null>();
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const [isFormSuccess, setIsFormSuccess] = useState(false);

  async function onSubmitWrapper(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsFormSubmitting(true);
    setFormError(null);
    const { user, session, error } = await props.onSubmit(event);
    console.log('user', user);
    console.log('session', session);
    console.log('error', error);
    // If there is no error, the value is conveniently null
    setFormError(error);
    if (session) {
      setIsFormSuccess(true);
      // Redirect to the main app if the user has been properly authenticated
      // with a session; the "Submitting..." button label will continue showing
      // while the browser is in the process of redirecting
      window.location.assign('/');
    } else {
      // Only stop showing "Submitting..." message if the authentication failed
      // somehow
      setIsFormSubmitting(false);
    }
  }

  return (
    <form className="account-auth-form" onSubmit={onSubmitWrapper}>

      {props.children}

      {formError?.message ? (
        <div className="account-auth-form-validation-area">
          <div className="account-auth-form-validation-message">{formError.message}</div>
        </div>
      ) : null}

      <button
        type="submit"
        className="account-auth-form-submit"
        disabled={isFormSubmitting || isFormSuccess}>
        {isFormSubmitting ?
          props.submittingLabel :
          isFormSuccess ?
            props.successLabel :
            props.submitLabel}
      </button>

    </form>
  );
}

export default AuthForm;
