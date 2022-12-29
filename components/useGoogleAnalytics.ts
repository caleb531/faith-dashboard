import { useEffect } from 'react';
import ReactGA4 from 'react-ga4';

type Options = Parameters<typeof ReactGA4.initialize>[1];

// The useGoogleAnalytics() hook is a simple abstraction around the react-ga
// library for loading and firing Google Analytics
function useGoogleAnalytics(trackingId: string, options: Options = {}) {
  // Initialize Google Analytics on the initial page load
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      process.env.NODE_ENV === 'production'
    ) {
      ReactGA4.initialize(trackingId, options);
    }
  }, [trackingId, options]);
  // Trigger a pageview even on the initial page load and when navigating to
  // another page on the site
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      process.env.NODE_ENV === 'production'
    ) {
      ReactGA4.send('pageview');
    }
  });
}
export default useGoogleAnalytics;
