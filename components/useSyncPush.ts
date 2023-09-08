import { AppState } from '@components/app/app.types';
import { debounce } from 'lodash-es';
import { useEffect, useMemo } from 'react';
import useObjectHasChanged from './useObjectHasChanged';
import { WidgetState } from './widgets/widget.types';

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
  state: T;
  upsertState: (state: T) => Promise<void>;
}): void {
  // There is no need to first check for an authenticated user here, as the
  // defined upsertState() method is responsible for retrieving and checking
  // the current user data (out of necessity, anyway)
  upsertState(state);
}

// The useSyncPush() hook is a utility hook (used by both the useAppSync() and
// useWidgetSync() hooks) which handles all logic related to pushing the state
// of the application to the database when changes are made locally
function useSyncPush<T extends AcceptableSyncStateTypes>({
  state,
  stateType,
  upsertState
}: {
  state: T;
  stateType: string;
  upsertState: (state: T) => Promise<any>;
}) {
  const [getStateChanges] = useObjectHasChanged(state);

  const evaluatePushDebounced = useMemo(() => {
    return debounce(({ state, upsertState }) => {
      const changes = getStateChanges();
      // In order for the app to run in SSR, the app is first initialized with
      // the default app state, and then the local app state is asynchronously
      // restored from localStorage; this restoring triggers a "change", meaning
      // that without the below 'id' check, the app would push to the database
      // when the page initially loads (even before any user interaction); to
      // skip over this initial "change" event, we check to see if the previous
      // app state has a non-empty 'id' property, which is guaranteed to be
      // non-empty by the time the user begins interacting with the app
      if (
        changes &&
        Object.keys(changes).length > 0 &&
        (!('id' in changes) || changes.id !== undefined)
      ) {
        pushStateToDatabase({ state, upsertState });
      }
    }, pushDebounceDelay);
    // getStateChanges() is stable, so it will never cause this useMemo() to
    // re-run
  }, [getStateChanges]);

  // Evaluate if the state has changed on every push
  useEffect(() => {
    evaluatePushDebounced({ state, upsertState });
  }, [state, evaluatePushDebounced, upsertState]);
}

export default useSyncPush;
