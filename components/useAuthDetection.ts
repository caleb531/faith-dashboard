import { useEffect } from 'react';
import { convertObjectToFormData } from './authUtils.client';

// The useAuthDetection() hook detects if an access token and refresh token are
// present in the URL, and if so, sends the values to the server so that the
// user can be automatically signed in; unfortunately, because the access token
// / refresh token are part of the hash segment of the URL, the parameters are
// invisible to the server; therefore, we must process these parameters on the
// client and send them to the server in a POST request; for more information,
// see <https://github.com/supabase/gotrue/issues/279>.
function useAuthDetection() {
  useEffect(() => {
    const hashPart = window.location.hash.slice(1);
    if (!hashPart) {
      return;
    }
    const hashParams = new URLSearchParams(hashPart);
    const access_token = hashParams.get('access_token');
    const refresh_token = hashParams.get('refresh_token');
    const redirectTo = '/reset-password';
    if (!(access_token && refresh_token)) {
      return;
    }
    const abortController = new AbortController();
    fetch(`/auth/session`, {
      method: 'POST',
      body: convertObjectToFormData({ access_token, refresh_token }),
      signal: abortController.signal
    }).then((response) => {
      console.log(response);
      // Redirect to the /reset-password page (with a hard reload so that the
      // newly-authenticated session is reflected in the UI)
      if (response.ok) {
        window.location.href = '/reset-password';
      }
    });
    return () => {
      // Make sure to cancel the request if the component re-mounts
      abortController.abort();
    };
  }, []);
}
export default useAuthDetection;
