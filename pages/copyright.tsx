import Head from 'next/head';
import Link from 'next/link';
import React from 'react';

function Copyright() {

  return (
    <article className="landing-page">
      <Head>
        <title>Copyright | Faith Dashboard</title>
        <link rel="canonical" href="https://faithdashboard.com/copyright/" />
        <meta property="og:title" content="Copyright | Faith Dashboard" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://faithdashboard.com/copyright/" />
        <meta property="og:image" content="https://faithdashboard.com/images/social-preview.png" />
        <meta
          name="description"
          property="og:description"
          content="Copyright information for Faith Dashboard, your one place for anything and everything that inspires your faith." />
      </Head>
      <h1>Copyright | Faith Dashboard</h1>

      <p>Scripture quotations marked “ESV” are from the ESV® Bible (The Holy Bible, English Standard Version®), copyright © 2001 by Crossway, a publishing ministry of Good News Publishers. Used by permission. All rights reserved. You may not copy or download more than 500 consecutive verses of the ESV Bible or more than one half of any book of the ESV Bible.</p>

      <p><Link href="/">Return to App</Link></p>
    </article>
  );

}
export default Copyright;
