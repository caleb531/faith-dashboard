import { ApiError, Session, User } from '@supabase/supabase-js';
import React, { useState } from 'react';

type Props = {
  className?: string,
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<{
    user: User | null,
    session: Session | null,
    error: ApiError | null
  }>,
  children: JSX.Element | (JSX.Element | null)[] | null
};

function AuthForm(props: Props) {

  const [formError, setFormError] = useState<ApiError | null>();

  async function onSubmitWrapper(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const { user, session, error } = await props.onSubmit(event);
    console.log('user', user);
    console.log('session', session);
    console.log('error', error);
    setFormError(error);
  }

  return (
    <form className="account-auth-form" onSubmit={onSubmitWrapper}>
      {props.children}
      {formError?.message ? (
        <div className="account-auth-form-validation-message">{formError.message}</div>
      ) : null}
    </form>
  );
}

export default AuthForm;
