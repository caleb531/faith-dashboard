import Head from 'next/head';
import React from 'react';

function AppHead() {
  return (
    <Head>
      <title>Faith Dashboard</title>
      <link rel="canonical" href="https://faithdashboard.com/" />
      <meta property="og:title" content="Faith Dashboard" />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://faithdashboard.com" />
      <meta property="og:image" content="https://faithdashboard.com/images/og-image.jpg" />
      <meta
        name="description"
        property="og:description"
        content="Be strengthened every day with this private board for your favorite Bible verses, sermons, and anything you need to be encouraged when life happens." />
    </Head>
  );
}

export default AppHead;
