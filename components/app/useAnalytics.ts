import * as goatcounter from 'goatcounter-js';
import { useEffect } from 'react';

goatcounter.initialize({
  scriptVersion: 4,
  endpointUrl: `https://${process.env.NEXT_PUBLIC_ANALYTICS_SITE_ID}.goatcounter.com/count`,
  settings: { no_onload: true }
});

// Use the
function useAnalytics() {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_ANALYTICS_SITE_ID) {
      goatcounter.count();
    }
  }, []);
}
export default useAnalytics;
