import LandingPage from '@components/LandingPage';
import LinkButton from '@components/reusable/LinkButton';
import { getPageMetadata } from '@components/seoUtils';

async function PrivacyPolicy() {
  return (
    <LandingPage heading="Privacy Policy | Faith Dashboard">
      <p>
        This privacy policy serves as a straightforward explanation of how Faith
        Dashboard collects and handles your personal information.
      </p>

      <p>This privacy policy was last updated on June 27th, 2022.</p>

      <h2>Secure Connection</h2>

      <p>
        Your connection to Faith Dashboard is fully encrypted via HTTPS,
        including (but not limited to) all stylesheets, scripts, and images. For
        more comprehensive details, see the{' '}
        <a href="https://www.ssllabs.com/ssltest/analyze.html?d=faithdashboard.com">
          SSL Labs report for faithdashboard.com
        </a>
        .
      </p>

      <h2>Local Storage</h2>

      <p>
        The apps on Faith Dashboard use the HTML5 Local Storage API to store
        user-inputted data and preferences. All of this data remains on your
        computer, and can be cleared through your web browser. The data contains
        no personally-identifiable information except whatever information you
        may enter into the app.
      </p>

      <h2>Account Creation</h2>

      <p>
        When you create an account on Faith Dashboard, Faith Dashboard will
        upload the contents of your dashboard to its servers. Your first name,
        last name, email, and dashboard are all private and only visible to you.
        Your password is stored in a secure hashing format on our databases to
        protect your account.
      </p>

      <h2>Account Deletion</h2>

      <p>
        If you created an account, you can request this data to be deleted by
        emailing{' '}
        <a href="mailto:support@faithdashboard.com">
          support@faithdashboard.com
        </a>{' '}
        from the email you signed up with.
      </p>

      <h2>Analytics</h2>

      <p>
        As of Februrary 9th, 2024, Faith Dashboard no longer collects any
        analytics.
      </p>

      <h2>Email Privacy</h2>

      <p>
        The only time Faith Dashboard will email you is if you request a
        password reset, or in response to a support request. If you choose to
        email support, your email will not be shared with anyone else with
        anyone else, nor will you be opted into any marketing emails.
      </p>

      <h2>Changes</h2>

      <p>
        This privacy policy may change at any time. When changes are made, the
        date at the top of this policy will be updated.
      </p>

      <p>
        <LinkButton href="/">Return to App</LinkButton>
      </p>
    </LandingPage>
  );
}

export function generateMetadata() {
  return getPageMetadata({
    path: '/privacy-policy',
    title: 'Privacy Policy | Faith Dashboard',
    description:
      'Privacy policy for Faith Dashboard, your home for strength and encouragement every day.'
  });
}

export default PrivacyPolicy;
