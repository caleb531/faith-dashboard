import LandingPage from '../../components/LandingPage';
import AccountSettingsForm from '../../components/account/AccountSettingsForm';
import { getPageMetadata } from '../../components/seoUtils';

function AccountSettings() {
  return (
    <LandingPage heading="Account Settings | Faith Dashboard">
      <AccountSettingsForm />
    </LandingPage>
  );
}

export function generateMetadata() {
  return getPageMetadata({
    path: '/account',
    title: 'Account Settings | Faith Dashboard',
    description:
      'Account settings for Faith Dashboard, your home for strength and encouragement every day.'
  });
}

export default AccountSettings;
