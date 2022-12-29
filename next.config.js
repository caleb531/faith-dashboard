const path = require('path');
const withPWA = require('next-pwa')(require('./next-pwa.config.js'));

/** @type {import('next').NextConfig} */
const nextConfig = withPWA({
  reactStrictMode: true,
  async headers() {
    const headers = [
      {
        key: 'X-Frame-Options',
        value: 'SAMEORIGIN'
      },
      {
        key: 'X-Content-Type-Options',
        value: 'nosniff'
      }
    ];
    // The HSTS header should only be sent for HTTPS websites; because localhost is server over plain HTTP, we do not want to enable HSTS there
    if (process.env.NODE_ENV === 'production') {
      headers.push({
        key: 'Strict-Transport-Security',
        value: 'max-age=15552000; includeSubDomains'
      });
    }
    return [{ source: '/:path*', headers }];
  }
});

module.exports = nextConfig;
