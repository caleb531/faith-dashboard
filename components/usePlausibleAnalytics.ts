import { useEffect } from 'react';

// The usePlausibleAnalytics() hook loads in the Plausible Analytics script
function usePlausibleAnalytics() {
  // Initialize Plausible Analytics on the initial page load
  useEffect(() => {
    // Do not run this useEffect again if the script is already on the page
    // (which could happen in React 18 Strict Mode)
    if (document.querySelector('script[src^="https://plausible.io"')) {
      return;
    }
    const script = document.createElement('script');
    script.defer = true;
    script.setAttribute('data-domain', window.location.hostname);
    script.src = 'https://plausible.io/js/script.js';
    document.body.appendChild(script);
  }, []);
}
export default usePlausibleAnalytics;
