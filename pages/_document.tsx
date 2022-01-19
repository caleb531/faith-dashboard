import Document, {
  DocumentContext, Head, Html, Main,
  NextScript
} from 'next/document';
import React from 'react';

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);

    return initialProps;
  }

  render() {
    return (
      <Html>
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
          <link href="https://fonts.googleapis.com/css2?family=Merriweather+Sans:wght@300;400&family=Merriweather:ital,wght@0,300;0,400;1,300;1,400&display=swap" rel="stylesheet" />
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
}

export default MyDocument;
