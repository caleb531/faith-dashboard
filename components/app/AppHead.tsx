import Head from 'next/head';
import React from 'react';

function AppHead() {
  const title = 'Faith Dashboard';
  const description = 'Be strengthened every day with this private board for your favorite Bible verses, sermons, and anything you need to be encouraged when life happens.';
  const image = 'https://faithdashboard.com/images/social-preview.jpg';
  const url = 'https://faithdashboard.com/';
  const twitterUsernameSite = '@faithdashboard';
  const twitterUsernameCreator = '@caleb531';
  return (
    <Head>
      <title>{title}</title>
      <link rel="canonical" href={url} />
      <meta property="og:title" content={title} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="2400" />
      <meta property="og:image:height" content="1260" />
      <meta property="og:description" content={description} />
      <meta name="description" content={description} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={twitterUsernameSite} />
      <meta name="twitter:creator" content={twitterUsernameCreator} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:url" content={url} />
    </Head>
  );
}

export default AppHead;
