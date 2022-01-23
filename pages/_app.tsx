import http from 'http';
import App, { AppContext, AppProps } from 'next/app';
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

// Permanently redirect www requests to non-www for all requests on the app
// domain
const wwwRegex = /^www\./;
function redirectWwwToNonWww(req: http.IncomingMessage, res: http.ServerResponse) {
  const host = String(req.headers.host);
  if (wwwRegex.test(host)) {
    const newHost = host.replace(wwwRegex, '');
    res.writeHead(301, { location: `http://${newHost}` });
    res.end();
  }
}

// Run server-side code on each request
AppWrapper.getInitialProps = async (appContext: AppContext) => {
  redirectWwwToNonWww(appContext.ctx.req, appContext.ctx.res);
  const appProps = await App.getInitialProps(appContext);
  return { ...appProps };
};

export default AppWrapper;
