'use client';
import AuthForm, { redirectToHome } from '@components/account/AuthForm';
import AuthFormField from '@components/account/AuthFormField';
import useAutoFocus from '@components/account/useAutoFocus';
import { useState } from 'react';
import useAllSearchParams from '../useAllSearchParams';

function SignInForm() {
  const params = useAllSearchParams();
  // We need to use component state (and useEffect below) to set the redirectTo
  // variable in order to ensure that the SSR output matches the client-side
  // output
  const [redirectTo, setRedirectTo] = useState('');
  const emailAutoFocusProps = useAutoFocus<HTMLInputElement>();

  function redirectToDestination() {
    if (params.redirect_to) {
      window.location.assign(params.redirect_to);
    } else {
      redirectToHome();
    }
  }

  return (
    <AuthForm
      action={'/auth/sign-in'}
      onSuccess={redirectToDestination}
      submitLabel="Sign In"
      submittingLabel="Submitting..."
      successLabel="Success! Redirecting..."
      altLink={{ title: 'Forgot Password?', href: '/forgot-password' }}
      useAjax
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
