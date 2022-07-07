// The usePasswordRecoveryRedirect() hook redirects the user to the dedicated
// /reset-password page if type=recovery is present in the URL (indicating that

import { useEffect } from 'react';
import { supabase } from './supabaseClient';

// this is a Supabase Password Recovery URL)
function usePasswordRecoveryRedirect() {
  useEffect(() => {
    supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        window.location.assign('/reset-password' + window.location.hash);
      }
    });
  }, []);
}
export default usePasswordRecoveryRedirect;
