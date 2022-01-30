/* eslint-disable react/no-unescaped-entities */
import Head from 'next/head';
import React from 'react';

function PageNotFound() {

  return (
    <article className="landing-page">
      <Head>
        <title>Page Not Found | Faith Dashboard</title>
        <meta property="og:image" content="https://faithdashboard.com/images/social-preview.png" />
      </Head>
      <h1>Page Not Found | Faith Dashboard</h1>

      <p>Sorry about that! You ended up on a page that doesn't exist.</p>

      <p><a href="/">Return to App</a></p>
    </article>
  );

}
export default PageNotFound;
