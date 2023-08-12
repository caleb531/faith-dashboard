'use client';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import AuthForm, { redirectToHome } from '../../components/account/AuthForm';
import AuthFormField from '../../components/account/AuthFormField';
import useAutoFocus from '../../components/account/useAutoFocus';

function SignInForm() {
  const supabase = createClientComponentClient();
  const emailAutoFocusProps = useAutoFocus<HTMLInputElement>();

  return (
    <AuthForm
      action="/auth/sign-in"
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
