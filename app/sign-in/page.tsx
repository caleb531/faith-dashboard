import LandingPage from '../../components/LandingPage';
import SignInForm from '../../components/account/SignInForm';
import { getPageMetadata } from '../../components/seoUtils';

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
export function generateMetadata() {
  return getPageMetadata({
    path: '/sign-in',
    title: 'Sign In | Faith Dashboard',
    description:
      'Sign into Faith Dashboard, your home for strength and encouragement every day.'
  });
}

export default SignIn;
