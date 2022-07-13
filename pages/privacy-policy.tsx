/* eslint-disable react/no-unescaped-entities */
import LandingPage from '../components/LandingPage';
import LinkButton from '../components/reusable/LinkButton';

function PrivacyPolicy() {
  return (
    <LandingPage heading="Privacy Policy | Faith Dashboard">
      <p>
        This privacy policy serves as a straightforward explanation of how Faith
        Dashboard collects and handles your personal information.
      </p>

      <p>This privacy policy was last updated on June 27th, 2022.</p>

      <h3>Secure Connection</h3>

      <p>
        Your connection to Faith Dashboard is fully encrypted via HTTPS,
        including (but not limited to) all stylesheets, scripts, and images. For
        more comprehensive details, see the{' '}
        <a href="https://www.ssllabs.com/ssltest/analyze.html?d=faithdashboard.com">
          SSL Labs report for faithdashboard.com
        </a>
        .
      </p>

      <h3>Local Storage</h3>

      <p>
        The apps on Faith Dashboard use the HTML5 Local Storage API to store
        user-inputted data and preferences. All of this data remains on your
        computer, and can be cleared through your web browser. The data contains
        no personally-identifiable information except whatever information you
        may enter into the app.
      </p>

      <h3>Account Creation</h3>

      <p>
        When you create an account on Faith Dashboard, Faith Dashboard will
        upload the contents of your dashboard to its servers. Your first name,
        last name, email, and dashboard are all private and only visible to you.
        Your password is stored in a secure hashing format on our databases to
        protect your account.
      </p>

      <h3>Account Deletion</h3>

      <p>
        If you created an account, you can request this data to be deleted by
        emailing{' '}
        <a href="mailto:support@faithdashboard.com">
          support@faithdashboard.com
        </a>{' '}
        from the email you signed up with.
      </p>

      <h3>Google Analytics</h3>

      <p>
        Faith Dashboard uses Google Analytics. I only use this information to
        examine traffic trends and visitor statistics (i.e. the percentage of
        Chrome users). However, you would need to read the{' '}
        <a href="https://support.google.com/analytics/answer/6004245?hl=en">
          Google Analytics privacy summary
        </a>
        to understand how Google collects and uses this information. I do not
        otherwise share this information.
      </p>

      <h3>Email Privacy</h3>

      <p>
        The only time Faith Dashboard will email you is if you request a
        password reset, or in response to a support request. If you choose to
        email support, your email will not be shared with anyone else with
        anyone else, nor will you be opted into any marketing emails.
      </p>

      <h3>Changes</h3>

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

export async function getStaticProps() {
  return {
    props: {
      pagePath: '/privacy-policy',
      pageTitle: 'Privacy Policy | Faith Dashboard',
      pageDescription:
        'Privacy policy for Faith Dashboard, your home for strength and encouragement every day.'
    }
  };
}

export default PrivacyPolicy;
