'use client';
/* eslint-disable react/no-unescaped-entities */
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { pick } from 'lodash-es';
import React from 'react';
import Captcha from '../../components/Captcha';
import AuthForm, { redirectToHome } from '../../components/account/AuthForm';
import AuthFormField from '../../components/account/AuthFormField';
import serializeForm from '../../components/account/serializeForm';
import useAutoFocus from '../../components/account/useAutoFocus';
import useFormFieldMatcher from '../../components/useFormFieldMatcher';
import useVerifyCaptcha from '../../components/useVerifyCaptcha';

function SignUpForm() {
  const supabase = createClientComponentClient();
  const [passwordFieldProps, confirmPasswordFieldProps] = useFormFieldMatcher({
    mismatchMessage: 'Passwords must match'
  });
  const firstNameAutoFocusProps = useAutoFocus<HTMLInputElement>();
  const [getCaptchaToken, setCaptchaToken] = useVerifyCaptcha();

  function signUp(event: React.FormEvent<HTMLFormElement>) {
    const fields = serializeForm(event.currentTarget);
    const captchaToken = getCaptchaToken();
    if (!captchaToken) {
      throw new Error('Please complete the CAPTCHA');
    }
    return supabase.auth.signUp({
      email: fields.email,
      password: fields.password,
      options: {
        captchaToken,
        data: pick(fields, ['first_name', 'last_name']),
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    });
  }

  return (
    <AuthForm
      onSubmit={signUp}
      onSuccess={redirectToHome}
      submitLabel="Sign Up"
      submittingLabel="Submitting..."
      successLabel="Success! Redirecting..."
    >
      <AuthFormField
        type="text"
        id="sign-up-form-first-name"
        name="first_name"
        placeholder="First Name"
        required
        {...firstNameAutoFocusProps}
      />
      <AuthFormField
        type="text"
        id="sign-up-form-last-name"
        name="last_name"
        placeholder="Last Name"
        required
      />
      <AuthFormField
        type="email"
        id="sign-up-form-email"
        name="email"
        placeholder="Email"
        required
      />
      <AuthFormField
        type="password"
        id="sign-up-form-password"
        name="password"
        placeholder="Password"
        required
        {...passwordFieldProps}
      />
      <AuthFormField
        type="password"
        id="sign-up-form-confirm-password"
        name="confirm_password"
        placeholder="Confirm Password"
        required
        {...confirmPasswordFieldProps}
      />
      <Captcha setCaptchaToken={setCaptchaToken} />
    </AuthForm>
  );
}

export default SignUpForm;
