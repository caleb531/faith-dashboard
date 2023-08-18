import '@fontsource/merriweather-sans/300.css';
import '@fontsource/merriweather-sans/400.css';
import '@fontsource/merriweather/300-italic.css';
import '@fontsource/merriweather/300.css';
import '@fontsource/merriweather/400-italic.css';
import '@fontsource/merriweather/400.css';
import '@styles/index.scss';
import '@styles/landing-page.scss';
import Script from 'next/script';
import React from 'react';

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <Script
          defer
          data-domain="faithdashboard.com"
          src="https://plausible.io/js/script.js"
        ></Script>
      </head>
      <body>{children}</body>
    </html>
  );
}
