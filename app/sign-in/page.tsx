/* eslint-disable react/no-unescaped-entities */
import { Metadata } from 'next';
import LandingPage from '../../components/LandingPage';
import SignInForm from '../../components/account/SignInForm';

function SignIn() {
  return (
    <LandingPage
      heading="Sign In | Faith Dashboard"
      altLink={{ title: 'Sign Up', href: '/sign-up' }}
    >
      <p>
        Sign in below to sync your settings and widgets across all your devices.
      </p>
      <SignInForm />
    </LandingPage>
  );
}

/* istanbul ignore next */
export const metadata: Metadata = {
  title: 'Sign In | Faith Dashboard',
  description:
    'Sign into Faith Dashboard, your home for strength and encouragement every day.'
};

export default SignIn;
