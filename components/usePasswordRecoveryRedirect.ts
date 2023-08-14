// The usePasswordRecoveryRedirect() hook redirects the user to the dedicated
// /reset-password page if type=recovery is present in the URL (indicating that

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect } from 'react';

// this is a Supabase Password Recovery URL)
function usePasswordRecoveryRedirect() {
  const supabase = createClientComponentClient();
  useEffect(() => {
    supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        window.location.assign('/reset-password' + window.location.hash);
      }
    });
  }, [supabase.auth]);
}
export default usePasswordRecoveryRedirect;
