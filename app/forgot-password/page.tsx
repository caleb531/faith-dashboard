/* eslint-disable react/no-unescaped-entities */
import { Metadata } from 'next';
import LandingPage from '../../components/LandingPage';
import ForgotPasswordForm from '../../components/account/ForgotPasswordForm';

function ForgotPassword() {
  return (
    <LandingPage
      heading="Forgot Password | Faith Dashboard"
      altLink={{ title: 'Sign In', href: '/sign-in' }}
    >
      <ForgotPasswordForm />
    </LandingPage>
  );
}

/* istanbul ignore next */
export const metadata: Metadata = {
  title: 'Forgot Password | Faith Dashboard',
  description:
    'Start the process to reset your account password for Faith Dashboard, your home for strength and encouragement every day.'
};

export default ForgotPassword;
