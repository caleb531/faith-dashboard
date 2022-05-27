import { useEffect } from 'react';
import { supabase } from '../supabaseClient';
import useObjectHasChanged from '../useObjectHasChanged';
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

  const [getAppChanges] = useObjectHasChanged(app);


  useEffect(() => {
    const changes = getAppChanges();
    // In order for the app to run in SSR, the app is first initialized with
    // the default app state, and then the local app state is asynchronously
    // restored from localStorage; this restoring triggers a "change", meaning
    // that without the below 'id' check, the app would push to the database
    // when the page initially loads (even before any user interaction); to
    // skip over this initial "change" event, we check to see if the previous
    // app state has a non-empty 'id' property, which is guaranteed to be
    // non-empty by the time the user begins interacting with the app
    if (changes && Object.keys(changes).length > 0 && (!('id' in changes) || changes.id !== undefined)) {
      console.log('dashboard push', app);
      pushAppToDatabase(app);
    } else {
      console.log('no dashboard changes to merge');
    }
  });

  // Subscribe to changes to the app/dashboard itself or to individual widgets
  useEffect(() => {
    const subscription = supabase
      .from('dashboards')
      .on('UPDATE', (payload) => {
        console.log('dashboard pull', payload);
      })
      .subscribe();
    console.log('subscribe');
  }, []);

}

export default useAppSync;
