import type { AppProps } from 'next/app';
import React from 'react';
import '../styles/index.scss';
import '../styles/landing-page.scss';

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
