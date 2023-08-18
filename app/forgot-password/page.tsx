import LandingPage from '@components/LandingPage';
import ForgotPasswordForm from '@components/account/ForgotPasswordForm';
import { getPageMetadata } from '@components/seoUtils';

async function ForgotPassword() {
  return (
    <LandingPage
      heading="Forgot Password | Faith Dashboard"
      altLink={{ title: 'Sign In', href: '/sign-in' }}
      redirectSignedInUsersTo="/account"
    >
      <ForgotPasswordForm />
    </LandingPage>
  );
}

/* istanbul ignore next */
export function generateMetadata() {
  return getPageMetadata({
    path: '/forgot-password',
    title: 'Forgot Password | Faith Dashboard',
    description:
      'Start the process to reset your account password for Faith Dashboard, your home for strength and encouragement every day.'
  });
}

export default ForgotPassword;
