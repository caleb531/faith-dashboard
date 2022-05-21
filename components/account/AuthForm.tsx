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
    const { user, session, error } = await props.onSubmit(event);
    console.log('user', user);
    console.log('session', session);
    console.log('error', error);
    setIsFormSubmitting(false);
    // If there is no error, the value is conveniently null
    setFormError(error);
    if (session) {
      setIsFormSuccess(true);
      // Redirect to the main app if the user has been properly authenticated
      // with a session
      window.location.assign('/');
    }
  }

  return (
    <form className="account-auth-form" onSubmit={onSubmitWrapper}>

      {props.children}

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

      {formError?.message ? (
        <div className="account-auth-form-validation-message">{formError.message}</div>
      ) : null}

    </form>
  );
}

export default AuthForm;
