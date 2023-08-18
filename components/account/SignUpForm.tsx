'use client';
import AuthForm, { redirectToHome } from '@components/account/AuthForm';
import AuthFormField from '@components/account/AuthFormField';
import useAutoFocus from '@components/account/useAutoFocus';
import useFormFieldMatcher from '@components/useFormFieldMatcher';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

function SignUpForm() {
  const supabase = createClientComponentClient();
  const [passwordFieldProps, confirmPasswordFieldProps] = useFormFieldMatcher({
    mismatchMessage: 'Passwords must match'
  });
  const firstNameAutoFocusProps = useAutoFocus<HTMLInputElement>();

  return (
    <AuthForm
      action="/auth/sign-up"
      onSuccess={redirectToHome}
      submitLabel="Sign Up"
      submittingLabel="Submitting..."
      successLabel="Success! Redirecting..."
      requireCaptcha
    >
      <AuthFormField
        type="text"
        id="sign-up-form-first-name"
        name="first_name"
        placeholder="First Name"
        required
        autoComplete="on"
        {...firstNameAutoFocusProps}
      />
      <AuthFormField
        type="text"
        id="sign-up-form-last-name"
        name="last_name"
        placeholder="Last Name"
        required
        autoComplete="on"
      />
      <AuthFormField
        type="email"
        id="sign-up-form-email"
        name="email"
        placeholder="Email"
        required
        autoComplete="on"
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
    </AuthForm>
  );
}

export default SignUpForm;
