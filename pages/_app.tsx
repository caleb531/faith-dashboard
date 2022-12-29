import { AppProps } from 'next/app';
import { PageProps } from '../components/global';
import PageHead from '../components/PageHead';
import useGoogleAnalytics from '../components/useGoogleAnalytics';
import '../styles/index.scss';
import '../styles/landing-page.scss';

function AppWrapper({ Component, pageProps }: AppProps<PageProps>) {
  useGoogleAnalytics('G-QDGNKNKW4E');
  return (
    <>
      <PageHead {...pageProps} />
      <Component {...pageProps} />
    </>
  );
}

export default AppWrapper;
