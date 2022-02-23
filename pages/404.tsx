/* eslint-disable react/no-unescaped-entities */
import Link from 'next/link';
import React from 'react';

function PageNotFound() {

  return (
    <article className="landing-page">
      <h1>Page Not Found | Faith Dashboard</h1>

      <p>Sorry about that! You ended up on a page that doesn't exist.</p>

      <p><Link href="/">Return to App</Link></p>
    </article>
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
