import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    // reporters: ['basic'],
    environment: 'jsdom',
    testTimeout: 20000,
    setupFiles: [
      './__tests__/__utils__/setupEnv.ts',
      './__tests__/__utils__/setupVitest.ts'
    ]
  },
  // By default Vite/Vitest only exposes environment variables with the `VITE_`
  // prefix; to change this, we can use the envPrefix configuration option
  envPrefix: 'NEXT_PUBLIC',
  resolve: {
    alias: [
      {
        find: /^(.*?)useVerifyCaptcha(.*?)$/,
        replacement: '/__tests__/__mocks__/captchaMockUtils.ts'
      },
      {
        find: /next\/link/,
        replacement: '/__tests__/__mocks__/LinkMock.tsx'
      },
      {
        find: 'next/headers',
        replacement: '/__tests__/__mocks__/nextHeaders.ts'
      },
      {
        find: 'next/server',
        replacement: '/__tests__/__mocks__/nextServer.ts'
      },
      {
        find: 'next/navigation',
        replacement: '/__tests__/__mocks__/nextNavigation.ts'
      },
      {
        find: 'workbox-window',
        replacement: '/__tests__/__mocks__/WorkboxWindowMock.ts'
      },
      {
        find: '@supabase/auth-helpers-nextjs',
        replacement: '/__tests__/__mocks__/supabaseAuthHelpersMock.ts'
      },
      {
        find: /(.*).(jpg|png|svg)$/,
        replacement: '/__tests__/__mocks__/imageMock.ts'
      },
      { find: /^@app\/(.*)$/, replacement: '/app/$1' },
      { find: /^@components\/(.*)$/, replacement: '/components/$1' },
      { find: /^@public\/(.*)$/, replacement: '/public/$1' },
      { find: /^@styles\/(.*)$/, replacement: '/styles/$1' },
      { find: /^@tests\/(.*)$/, replacement: '/__tests__/$1' }
    ]
  }
});
