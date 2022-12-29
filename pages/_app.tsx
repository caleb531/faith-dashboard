import { AppProps } from 'next/app';
import { PageProps } from '../components/global';
import PageHead from '../components/PageHead';
import '../styles/index.scss';
import '../styles/landing-page.scss';

function AppWrapper({ Component, pageProps }: AppProps<PageProps>) {
  return (
    <>
      <PageHead {...pageProps} />
      <Component {...pageProps} />
    </>
  );
}

export default AppWrapper;
