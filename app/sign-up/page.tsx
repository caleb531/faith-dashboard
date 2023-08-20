import LandingPage from '@components/LandingPage';
import SignUpForm from '@components/account/SignUpForm';
import { getPageMetadata } from '@components/seoUtils';

async function SignUp() {
  return (
    <LandingPage
      heading="Sign Up | Faith Dashboard"
      altLink={{ title: 'Sign In', href: '/sign-in' }}
    >
      <p>
        By signing up for Faith Dashboard with a free account, you'll be able to
        sync your settings and widgets across all your devices.
      </p>
      <SignUpForm />
    </LandingPage>
  );
}

export function generateMetadata() {
  return getPageMetadata({
    path: '/sign-up',
    title: 'Sign Up | Faith Dashboard',
    description:
      'Sign up for Faith Dashboard, your home for strength and encouragement every day.'
  });
}

export default SignUp;
