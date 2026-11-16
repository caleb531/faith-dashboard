/** Supplies the declarations missing from next-pwa's CommonJS package */
declare module 'next-pwa' {
  import type { NextConfig } from 'next';

  /** Represents the PWA options used by this application's configuration */
  interface PWAOptions {
    /** Controls the output location and name of the generated service worker */
    dest?: string;
    sw?: string;
    /** Controls service-worker registration and development behavior */
    register?: boolean;
    /** Controls whether the start URL can store personalized page responses */
    cacheStartUrl?: boolean;
    dynamicStartUrl?: boolean;
    /** Loads activation cleanup alongside the generated Workbox worker */
    importScripts?: string[];
    disable?: boolean;
    skipWaiting?: boolean;
    /** Configures runtime cache behavior and generated-file exclusions */
    runtimeCaching?: unknown[];
    buildExcludes?: RegExp[];
  }

  /** Augments a Next.js configuration with PWA service-worker behavior */
  function nextPWA(
    options?: PWAOptions
  ): (nextConfig: NextConfig) => NextConfig;

  export default nextPWA;
}

/** Types next-pwa's built-in Workbox runtime-cache configuration */
declare module 'next-pwa/cache' {
  const runtimeCaching: unknown[];

  export default runtimeCaching;
}
