'use client';
import { useEffect, useState } from 'react';
import AuthForm, { redirectToHome } from '../../components/account/AuthForm';
import AuthFormField from '../../components/account/AuthFormField';
import useAutoFocus from '../../components/account/useAutoFocus';
import useAllSearchParams from '../useAllSearchParams';

function SignInForm() {
  const params = useAllSearchParams();
  // We need to use component state (and useEffect below) to set the redirectTo
  // variable in order to ensure that the SSR output matches the client-side
  // output
  const [redirectTo, setRedirectTo] = useState('');
  const emailAutoFocusProps = useAutoFocus<HTMLInputElement>();

  useEffect(() => {
    if (params.redirect_to) {
      setRedirectTo(params.redirect_to);
    }
  }, [params.redirect_to]);

  // TODO: handle ?redirect_to parameter that could be present on the URL for
  // the Sign In page
  return (
    <AuthForm
      action={
        redirectTo
          ? `/auth/sign-in?redirect_to=${encodeURIComponent(redirectTo)}`
          : '/auth/sign-in'
      }
      onSuccess={redirectToHome}
      submitLabel="Sign In"
      submittingLabel="Submitting..."
      successLabel="Success! Redirecting..."
      altLink={{ title: 'Forgot Password?', href: '/forgot-password' }}
    >
      <AuthFormField
        type="email"
        id="sign-in-form-email"
        name="email"
        placeholder="Email"
        required
        {...emailAutoFocusProps}
      />
      <AuthFormField
        type="password"
        id="sign-in-form-password"
        name="password"
        placeholder="Password"
        required
      />
    </AuthForm>
  );
}

export default SignInForm;
