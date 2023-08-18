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
    if (process.env.NODE_ENV === 'production') {
      // The HSTS header should only be sent for HTTPS websites; because
      // localhost is server over plain HTTP, we do not want to enable HSTS
      // there
      headers.push({
        key: 'Strict-Transport-Security',
        value: 'max-age=15552000; includeSubDomains'
      });
      // Only apply Content Security Policy for production build
      headers.push({
        key: 'Content-Security-Policy',
        /* eslint-disable quotes */
        value:
          "default-src 'none'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://hcaptcha.com https://*.hcaptcha.com; font-src 'self' https://fonts.gstatic.com data:; img-src * data:; script-src 'self' 'unsafe-inline' https://storage.googleapis.com https://plausible.io https://hcaptcha.com https://*.hcaptcha.com; child-src 'self' https://hcaptcha.com https://*.hcaptcha.com; prefetch-src 'self'; connect-src *; manifest-src 'self'; media-src *;"
        /* eslint-enable quotes */
      });
    }
    return [{ source: '/:path*', headers }];
  }
});

module.exports = nextConfig;
