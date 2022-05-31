import { User } from '@supabase/supabase-js';
import { debounce } from 'lodash-es';
import { useEffect, useMemo } from 'react';
import { AppState } from './app/app.d';
import { supabase } from './supabaseClient';
import useObjectHasChanged from './useObjectHasChanged';
import { WidgetState } from './widgets/widget';

// The number of milliseconds to wait since the last state change before
// pushing the state to the server
const pushDebounceDelay = 1000;

// The object types that can be synced between client and server
type AcceptableSyncStateTypes = AppState | WidgetState;

  // Send the supplied state data to the relevant table in the database
function pushStateToDatabase<T extends AcceptableSyncStateTypes>({
  state,
  upsertState
}: {
  state: T,
  upsertState: ({ state, user }: { state: T, user: User }) => Promise<void>
}): void {
  const user = supabase.auth.user();
  if (!user) {
    return;
  }
  upsertState({ state, user });
}

// The useSyncPush() hook is a utility hook (used by both the useAppSync() and
// useWidgetSync() hooks) which handles all logic related to pushing the state
// of the application to the database when changes are made locally
function useSyncPush<T extends AcceptableSyncStateTypes>({
  state,
  stateType,
  upsertState
}: {
  state: T,
  stateType: string,
  upsertState: ({ state, user }: { state: T, user: User }) => Promise<void>
}) {

  const [getStateChanges] = useObjectHasChanged(state);

  const evaluatePushDebounced = useMemo(() => {
    return debounce(({ state, upsertState }) => {
      if (!supabase.auth.session()) {
        return;
      }
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
        pushStateToDatabase({ state, upsertState });
      } else {
        console.log(`${stateType} no changes to merge`);
      }
    }, pushDebounceDelay);
    // getStateChanges() is stable, so it will never cause this useMemo()
  }, [stateType, getStateChanges]);

  // Evaluate if the state has changed on every push
  useEffect(() => {
    evaluatePushDebounced({ state, upsertState });
  }, [state, evaluatePushDebounced, upsertState]);

}

export default useSyncPush;
