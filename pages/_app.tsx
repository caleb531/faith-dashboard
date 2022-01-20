import type { AppProps } from 'next/app';
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
  return <Component {...pageProps} />;
}

export default AppWrapper;
