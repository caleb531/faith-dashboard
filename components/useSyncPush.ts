import { User } from '@supabase/supabase-js';
import { useEffect } from 'react';
import { AppState } from './app/app.d';
import { supabase } from './supabaseClient';
import useObjectHasChanged from './useObjectHasChanged';
import { WidgetState } from './widgets/widget';

type AcceptableSyncStateTypes = AppState | WidgetState;

// The useSyncPush() hook is a utility hook (used by both the useAppSync() and
// useWidgetSync() hooks) which handles all logic related to pushing the state
// of the application to the database when changes are made locally
function useSyncPush<T extends AcceptableSyncStateTypes>({
  state,
  upsert
}: {
  state: T,
  upsert: ({ state, user }: { state: T, user: User }) => Promise<void>
}) {

  const [getStateChanges] = useObjectHasChanged(state);

  // Send the supplied state data to the relevant table in the database
  async function pushStateToDatabase(state: T): Promise<void> {
    const user = supabase.auth.user();
    if (!user) {
      return;
    }
    upsert({ state, user });
  }

  function evaluatePush() {
    const changes = getStateChanges();
    // In order for the app to run in SSR, the app is first initialized with
    // the default app state, and then the local app state is asynchronously
    // restored from localStorage; this restoring triggers a "change", meaning
    // that without the below 'id' check, the app would push to the database
    // when the page initially loads (even before any user interaction); to
    // skip over this initial "change" event, we check to see if the previous
    // app state has a non-empty 'id' property, which is guaranteed to be
    // non-empty by the time the user begins interacting with the app
    if (changes && Object.keys(changes).length > 0 && (!('id' in changes) || changes.id !== undefined)) {
      console.log('push', state);
      pushStateToDatabase(state);
    } else {
      console.log('no changes to merge');
    }
  }

  // Evaluate if the state has changed on every push
  useEffect(() => {
    evaluatePush();
  });

}

export default useSyncPush;
