/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import LinkButton from '../components/generic/LinkButton';
import LandingPage from '../components/LandingPage';

type Props = {
  pageTitle: string;
};

function PageNotFound({ pageTitle }: Props) {
  return (
    <LandingPage heading={pageTitle}>
      <p>Sorry about that! You ended up on a page that doesn't exist.</p>

      <p>
        <LinkButton href="/">Return to App</LinkButton>
      </p>
    </LandingPage>
  );
}

export async function getStaticProps() {
  return {
    props: {
      pageTitle: 'Page Not Found | Faith Dashboard'
    }
  };
}

export default PageNotFound;
