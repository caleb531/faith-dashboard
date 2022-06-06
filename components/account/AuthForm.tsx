import { ApiError, Session, User } from '@supabase/supabase-js';
import React, { useState } from 'react';

// The number of milliseconds to show the success label of the Submit button
// before reverting to the initial Submit button label
const successLabelDuration = 2000;

type Props = {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<{
    user: User | null,
    session?: Session | null,
    error: ApiError | null
  }>,
  onSuccess?: ({ user, session }: {
    user: User | null,
    session?: Session | null
  }) => boolean | void,
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
      setTimeout(() => {
        setIsFormSuccess(false);
      }, successLabelDuration);
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
        {isFormSubmitting && props.submittingLabel ?
          props.submittingLabel :
          isFormSuccess && props.successLabel ?
            props.successLabel :
            props.submitLabel}
      </button>

    </form>
  );
}

export default AuthForm;
