import '@app/fonts';
import '@styles/index.scss';
import '@styles/landing-page.scss';
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
      </head>
      <body>{children}</body>
    </html>
  );
}
