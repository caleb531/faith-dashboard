/* eslint-disable react/no-unescaped-entities */
import Link from 'next/link';
import React from 'react';
import LandingPage from '../components/LandingPage';

function PageNotFound() {

  return (
    <LandingPage>
      <h1>Page Not Found | Faith Dashboard</h1>

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
