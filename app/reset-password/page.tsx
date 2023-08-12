/* eslint-disable react/no-unescaped-entities */
import { Metadata } from 'next';
import LandingPage from '../../components/LandingPage';
import ResetPasswordForm from '../../components/account/ResetPasswordForm';

function ResetPassword() {
  return (
    <LandingPage
      heading="Reset Password | Faith Dashboard"
      altLink={{ title: 'Sign In', href: '/sign-in' }}
    >
      <ResetPasswordForm />
    </LandingPage>
  );
}

/* istanbul ignore next */
export const metadata: Metadata = {
  title: 'Reset Password | Faith Dashboard',
  description:
    'Reset your account password for Faith Dashboard, your home for strength and encouragement every day.'
};

export default ResetPassword;
