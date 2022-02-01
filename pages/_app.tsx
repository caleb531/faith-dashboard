import { AppProps } from 'next/app';
import Head from 'next/head';
import React, { useEffect } from 'react';
import TagManager from 'react-gtm-module';
import '../styles/index.scss';
import '../styles/landing-page.scss';

function AppWrapper({ Component, pageProps }: AppProps) {
  // Initialize Google Tag Manager when page is mounted
  useEffect(() => {
    if (typeof window !== 'undefined') {
      TagManager.initialize({ gtmId: 'GTM-M3QKM2Z' });
    }
  }, []);
  return (
    <>
      <Head>
        {/* Prevent viewport from zooming in when focusing inputs on iOS; according to StackOverflow, this meta tag must be added to _app instead of _document in order for proper de-duping (since NextJS already adds a 'meta viewport' tag to the page by default); source: https://stackoverflow.com/a/65833542/560642 */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default AppWrapper;
