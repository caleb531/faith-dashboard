import { useEffect } from 'react';
import { supabase } from '../supabaseClient';
import useSyncPush from '../useSyncPush';
import { AppState } from './app.d';

// Send the supplied app data to the apps table in the database
async function pushAppToDatabase(app: AppState): Promise<void> {
  const user = supabase.auth.user();
  if (!user) {
    return;
  }
  await supabase
    .from('dashboards')
    .upsert([
      {
        id: app.id,
        user_id: user.id,
        raw_data: JSON.stringify(app)
      }
    ]);
}

// The useAppSync() hook
function useAppSync(
  app: AppState
): void {

  useSyncPush({
    state: app,
    upsert: async ({ state, user }) => {
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
