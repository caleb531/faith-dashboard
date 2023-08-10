import { AppProps } from 'next/app';
import PageHead from '../components/PageHead';
import { PageProps } from '../components/global.types';
import usePlausibleAnalytics from '../components/usePlausibleAnalytics';
import '../styles/index.scss';
import '../styles/landing-page.scss';

function AppWrapper({ Component, pageProps }: AppProps<PageProps>) {
  usePlausibleAnalytics();
  return (
    <>
      <PageHead {...pageProps} />
      <Component {...pageProps} />
    </>
  );
}

export default AppWrapper;
