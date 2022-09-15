import { AppProps } from 'next/app';
import { useEffect } from 'react';
import TagManager from 'react-gtm-module';
import { PageProps } from '../components/global';
import PageHead from '../components/PageHead';
import '../styles/index.scss';
import '../styles/landing-page.scss';

function AppWrapper({ Component, pageProps }: AppProps<PageProps>) {
  // Initialize Google Tag Manager when page is mounted
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      process.env.NODE_ENV === 'production'
    ) {
      TagManager.initialize({ gtmId: 'GTM-M3QKM2Z' });
    }
  }, []);
  return (
    <>
      <PageHead {...pageProps} />
      <Component {...pageProps} />
    </>
  );
}

export default AppWrapper;
