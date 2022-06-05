import React from 'react';
import LandingPage from '../components/LandingPage';

function AccountSettings() {
  return (
    <LandingPage heading="Account Settings | Faith Dashboard">
      <p>Coming Soon</p>
    </LandingPage>
  );
}

export async function getStaticProps() {
  return {
    props: {
      pageTitle: 'Account Settings | Faith Dashboard'
    }
  };
}

export default AccountSettings;
