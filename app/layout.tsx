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
