'use client';
import AuthForm from '@components/account/AuthForm';
import AuthFormField from '@components/account/AuthFormField';
import useAutoFocus from '@components/account/useAutoFocus';

function ForgotPasswordForm() {
  const emailAutoFocusProps = useAutoFocus<HTMLInputElement>();

  return (
    <AuthForm
      action="/auth/request-password-reset"
      submitLabel="Send Email"
      submittingLabel="Sending..."
      successLabel="Almost done! Check your email to finish resetting"
      useAjax
    >
      <AuthFormField
        type="email"
        id="forgot-password-form-email"
        name="email"
        placeholder="Email"
        required
        {...emailAutoFocusProps}
      />
    </AuthForm>
  );
}

export default ForgotPasswordForm;
