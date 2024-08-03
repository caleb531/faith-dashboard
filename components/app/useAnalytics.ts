import { useEffect } from 'react';

// Define a basic type for the goatcounter global
declare global {
  interface Window {
    goatcounter?: {
      count: (options: object) => void;
    };
  }
}

// Resolve a promise when GoatCounter is fully loaded and ready to use on the
// page
export async function getGoatcounter(): Promise<
  NonNullable<typeof window.goatcounter>
> {
  return new Promise((resolve) => {
    if (window.goatcounter) {
      resolve(window.goatcounter);
    } else {
      const script = document.createElement('script');
      script.addEventListener('load', () => {
        if (window.goatcounter) {
          resolve(window.goatcounter);
        } else {
          console.log('goatcounter script loaded but global not available');
        }
      });
      script.async = true;
      script.dataset.goatcounter = `https://${process.env.NEXT_PUBLIC_ANALYTICS_SITE_ID}.goatcounter.com/count`;
      script.dataset.goatcounterSettings = JSON.stringify({ no_onload: true });
      script.src = 'https://gc.zgo.at/count.v4.js';
      script.crossOrigin = 'anonymous';
      script.integrity =
        'sha384-nRw6qfbWyJha9LhsOtSb2YJDyZdKvvCFh0fJYlkquSFjUxp9FVNugbfy8q1jdxI+';
      document.head.appendChild(script);
    }
  });
}

// Count a single pageview with GoatCounter
export async function countPageview() {
  const goatcounter = await getGoatcounter();
  goatcounter.count({
    path: location.pathname + location.search + location.hash
  });
}

// Use the
function useAnalytics() {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_ANALYTICS_SITE_ID) {
      countPageview();
    }
  }, []);
}
export default useAnalytics;
