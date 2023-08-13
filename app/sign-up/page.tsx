/* eslint-disable react/no-unescaped-entities */
import LandingPage from '../../components/LandingPage';
import SignUpForm from '../../components/account/SignUpForm';
import { getPageMetadata } from '../../components/seoUtils';

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
export function generateMetadata() {
  return getPageMetadata({
    path: '/sign-up',
    title: 'Sign Up | Faith Dashboard',
    description:
      'Sign up for Faith Dashboard, your home for strength and encouragement every day.'
  });
}

export default SignUp;
