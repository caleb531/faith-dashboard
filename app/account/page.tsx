import LandingPage from '../../components/LandingPage';
import AccountSettingsForm from '../../components/account/AccountSettingsForm';

function AccountSettings() {
  return (
    <LandingPage heading="Account Settings | Faith Dashboard">
      <AccountSettingsForm />
    </LandingPage>
  );
}

export async function getStaticProps() {
  return {
    props: {
      pageTitle: 'Account Settings | Faith Dashboard',
      pageDescription:
        'Account settings for Faith Dashboard, your home for strength and encouragement every day.'
    }
  };
}

export default AccountSettings;
