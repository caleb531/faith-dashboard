import { AppProps } from 'next/app';
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

// TODO: the below getInitialProps() function (to enable automatic redirects
// from www to non-www) seems to break Font Optimization
// (https://nextjs.org/docs/basic-features/font-optimization); to fix, the
// below code has been commented out, but we still desire a solution to
// properly redirect www to non-www without breaking other functionality

// // Permanently redirect www requests to non-www for all requests on the app
// // domain
// const wwwRegex = /^www\./;
// function redirectWwwToNonWww(req: http.IncomingMessage, res: http.ServerResponse) {
//   const host = String(req.headers.host);
//   if (wwwRegex.test(host)) {
//     const newHost = host.replace(wwwRegex, '');
//     res.writeHead(301, { location: `http://${newHost}` });
//     res.end();
//   }
// }

// // Run server-side code on each request
// AppWrapper.getInitialProps = async (appContext: AppContext) => {
//   redirectWwwToNonWww(appContext.ctx.req, appContext.ctx.res);
//   const appProps = await App.getInitialProps(appContext);
//   return { ...appProps };
// };

export default AppWrapper;
