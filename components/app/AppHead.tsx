import Head from 'next/head';
import React from 'react';

function AppHead() {
  return (
    <Head>
      <title>Faith Dashboard | Your place for encouragement every day</title>
      <link rel="canonical" href="https://faithdashboard.com/" />
      <meta property="og:title" content="Faith Dashboard | Your place for encouragement every day" />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://faithdashboard.com" />
      <meta property="og:image" content="https://faithdashboard.com/images/og-image.jpg" />
      <meta
        name="description"
        property="og:description"
        content="A private board for your favorite Bible verses, sermons, and anything you'd like. Come back to it whenever you need encouragement, wisdom, or simple truth." />
    </Head>
  );
}

export default AppHead;
