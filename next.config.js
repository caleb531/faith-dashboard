const path = require('path');
const withPWA = require('next-pwa');

/** @type {import('next').NextConfig} */
const nextConfig = withPWA({
  reactStrictMode: true,
  pwa: {
    // The destination directory of the generated service worker
    dest: 'public',
    // The name of the generated service worker
    sw: 'service-worker.js',
    // Do not automatically register the service worker; we take care of that
    // manually in UpdateNotification.tsx
    register: false,
    // Disable service worker generation in development mode
    // (source: https://stackoverflow.com/a/67124165/560642)
    disable: process.env.NODE_ENV === 'development',
    // Enable app to reload service worker when clicking update banner
    skipWaiting: true
  }
});

module.exports = nextConfig;
