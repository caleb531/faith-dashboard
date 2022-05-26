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

  const [appHasChanged] = useObjectHasChanged(app);

  useEffect(() => {
    if (appHasChanged()) {
      pushAppToDatabase(app);
    }
  });

}

export default useAppSync;
