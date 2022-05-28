import { useEffect } from 'react';
import { supabase } from '../supabaseClient';
import useSyncPush from '../useSyncPush';
import { AppState } from './app.d';

// The useAppSync() hook
function useAppSync(
  app: AppState
): void {

  useSyncPush({
    state: app,
    upsertState: async ({ state, user }) => {
      await supabase
        .from('dashboards')
        .upsert([
          {
            id: state.id,
            user_id: user.id,
            raw_data: JSON.stringify(state)
          }
        ]);
    }
  });

  // Subscribe to changes to the app/dashboard itself or to individual widgets
  useEffect(() => {
    supabase
      .from('dashboards')
      .on('UPDATE', (payload) => {
        console.log('dashboard pull', payload);
      })
      .subscribe();
    console.log('subscribe');
  }, []);

}

export default useAppSync;
