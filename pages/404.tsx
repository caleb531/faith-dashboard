/* eslint-disable react/no-unescaped-entities */
import Link from 'next/link';
import React from 'react';
import LandingPage from '../components/LandingPage';

type Props = {
  pageTitle: string
};

function PageNotFound({ pageTitle }: Props) {

  return (
    <LandingPage heading={pageTitle}>

      <p>Sorry about that! You ended up on a page that doesn't exist.</p>

      <p><Link href="/"><a className="button">Return to App</a></Link></p>
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
