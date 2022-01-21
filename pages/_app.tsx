import { GetServerSideProps } from 'next';
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

// A regular express used for matching a www domain
const wwwRegex = /^www\./;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req, res } = context;
  if (wwwRegex.test(req.headers.host)) {
    res.writeHead(301, {
      location: 'https://' + req.headers.host.replace(/^www./, '') + req.url
    });
    res.end();
  }
  return { props: {} };
};

export default AppWrapper;
