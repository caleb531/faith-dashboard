import '@fontsource/merriweather-sans/300.css';
import '@fontsource/merriweather-sans/400.css';
import '@fontsource/merriweather/300-italic.css';
import '@fontsource/merriweather/300.css';
import '@fontsource/merriweather/400-italic.css';
import '@fontsource/merriweather/400.css';
import React from 'react';
import '../styles/index.scss';
import '../styles/landing-page.scss';

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
        <link rel="shortcut icon" href="/app-icons/favicon.png" />
        <link rel="apple-touch-icon" href="/app-icons/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <script
          defer
          data-domain="faithdashboard.com"
          src="https://plausible.io/js/script.js"
        ></script>
      </head>
      <body>{children}</body>
    </html>
  );
}
