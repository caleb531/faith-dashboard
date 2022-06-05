import React from 'react';
import LandingPage from '../components/LandingPage';

type Props = {
  pageTitle: string
};

function AccountSettings({ pageTitle }: Props) {
  return (
    <LandingPage heading={pageTitle}>
      <p>Coming Soon</p>
    </LandingPage>
  );
}

export async function getStaticProps() {
  return {
    props: {
      pageTitle: 'Account Settings | Faith Dashboard',
      pageDescription: 'Account settings for Faith Dashboard, your one place for anything and everything that inspires your faith.'
    }
  };
}

export default AccountSettings;
