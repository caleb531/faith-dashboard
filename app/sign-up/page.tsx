/* eslint-disable react/no-unescaped-entities */
import { Metadata } from 'next';
import LandingPage from '../../components/LandingPage';
import SignUpForm from '../../components/account/SignUpForm';

function SignUp() {
  return (
    <LandingPage
      heading="Sign Up | Faith Dashboard"
      altLink={{ title: 'Sign In', href: '/sign-in' }}
    >
      <p>
        By signing up with Faith Dashboard, you'll be able to sync your settings
        and widgets across all your devices.
      </p>
      <SignUpForm />
    </LandingPage>
  );
}

/* istanbul ignore next */
export const metadata: Metadata = {
  title: 'Sign Up | Faith Dashboard',
  description:
    'Sign up for Faith Dashboard, your home for strength and encouragement every day.'
};

export default SignUp;
