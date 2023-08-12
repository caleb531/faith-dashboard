import { Metadata } from 'next';
import React from 'react';
import '../styles/index.scss';
import '../styles/landing-page.scss';

export const metadata: Metadata = {
  title: 'Faith Dashboard',
  description:
    'Be strengthened every day with this private board for your favorite Bible verses, sermons, and anything else you need to be encouraged when life happens.'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
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
