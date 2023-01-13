import { AppProps } from 'next/app';
import { PageProps } from '../components/global';
import PageHead from '../components/PageHead';
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
