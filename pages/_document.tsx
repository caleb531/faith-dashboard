import { Head, Html, Main, NextScript } from 'next/document';
import useGoogleAnalytics from '../components/useGoogleAnalytics';

// Generate a nonce for use by the CSP
function generateNonce() {
  return Math.round(Math.random() * 1e16).toString(16);
}

function AppDocument() {
  const ga4Nonce = generateNonce();
  useGoogleAnalytics('G-QDGNKNKW4E', {
    nonce: ga4Nonce
  });
  return (
    <Html lang="en">
      <Head>
        {process.env.NODE_ENV === 'production' ? (
          <meta
            httpEquiv="Content-Security-Policy"
            content={`default-src 'none'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://hcaptcha.com https://*.hcaptcha.com; font-src 'self' https://fonts.gstatic.com data:; img-src * data:; script-src 'self' 'nonce-${ga4Nonce}' https://storage.googleapis.com www.googletagmanager.com https://hcaptcha.com https://*.hcaptcha.com; child-src 'self' https://hcaptcha.com https://*.hcaptcha.com; prefetch-src 'self'; connect-src *; manifest-src 'self'; media-src *;`}
          />
        ) : null}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Merriweather+Sans:wght@300;400&family=Merriweather:ital,wght@0,300;0,400;1,300;1,400&display=swap"
          rel="stylesheet"
        />
        <link rel="shortcut icon" href="/app-icons/favicon.png" />
        <link rel="apple-touch-icon" href="/app-icons/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

export default AppDocument;
