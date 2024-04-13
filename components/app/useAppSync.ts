import usePreviousValueMemoizer from '@components/usePreviousValueMemoizer';
import { throttle } from 'lodash-es';
import { Dispatch, useCallback, useEffect, useMemo } from 'react';
import {
  getSession,
  getUser,
  isSessionActive,
  supabase
} from '../authUtils.client';
import { getClientId } from '../syncUtils';
import useSyncPush from '../useSyncPush';
import { WidgetHead, WidgetState } from '../widgets/widget.types';
import widgetSyncService from '../widgets/widgetSyncService';
import { AppAction } from './AppReducer';
import { SyncContextType } from './SyncContext';
import { AppState, SyncResponse, SyncedAppState } from './app.types';

// Take the new app/dashboard state from the server and apply it to the local
// application
async function applyServerAppToLocalApp(
  newApp: AppState,
  dispatchToApp: Dispatch<AppAction>
): Promise<SyncResponse> {
  if (!isSessionActive(await getSession())) {
    return { error: null };
  }
  dispatchToApp({
    type: 'replaceApp',
    payload: newApp
  });
  const response = await supabase
    .from('widgets')
    .select('raw_data')
    .match({ dashboard_id: newApp.id });
  if (response?.error) {
    return response;
  }
  if (!(response.data && response.data.length > 0)) {
    return { error: null };
  }
  const newWidgets: WidgetState[] = response.data.map((widgetRow) => {
    return widgetRow.raw_data;
  });
  newWidgets.forEach((widget) => {
    widgetSyncService.broadcastPull(widget.id, widget);
  });
  return { error: null };
}

// Push all local widgets to the server (this is only necessary as a one-time
// operation)
async function pushLocalWidgetsToServer(app: AppState): Promise<void> {
  app.widgets.forEach((widgetHead: WidgetHead) => {
    widgetSyncService.broadcastPush(widgetHead.id);
  });
}

// The useAppSync() hook mangages the sychronization of the app state between
// the client and server, pushing and pulling data as appropriate
function useAppSync(
  app: AppState,
  dispatchToApp: Dispatch<AppAction>
): SyncContextType {
  const [prevAppIdRef, currentAppIdRef] = usePreviousValueMemoizer(app.id);

  // Push the local application state to the server (and optionally push the
  // widgets as well); this function runs when the app changes, but also once
  // when there is no app state on the server
  const pushAppToServer = useCallback(
    async (
      app: AppState,
      { includeWidgets = false }: { includeWidgets?: boolean } = {}
    ): Promise<SyncResponse> => {
      if (!app.id) {
        return { error: null };
      }
      const user = await getUser();
      if (!user) {
        return { error: null };
      }
      const response = await supabase.from('dashboards').upsert([
        {
          id: app.id,
          user_id: user.id,
          client_id: getClientId(),
          raw_data: app as SyncedAppState,
          updated_at: new Date().toISOString()
        }
      ]);
      if (response?.error) {
        return response;
      }
      if (
        includeWidgets ||
        // The dashboard passed to this function may not be the active/current
        // dashboard (e.g. in the case of renaming a dashboard), and we would
        // only ever want to push widgets for a dashboard that is the current;
        // therefore, we must verify that the ID of the provided app matches the
        // recorded ID of the current app as part of the condition to
        // automatically push widgets
        (currentAppIdRef.current === app.id &&
          prevAppIdRef.current &&
          prevAppIdRef.current !== app.id)
      ) {
        await pushLocalWidgetsToServer(app);
      }
      return response;
    },
    [prevAppIdRef, currentAppIdRef]
  );

  // Push the local app state to the server every time the app state changes
  // locally; please note that this push operation is debounced
  useSyncPush({
    state: app,
    stateType: 'app',
    upsertState: pushAppToServer
  });

  // Replace the local application state with the latest application state from
  // the server; if there is no app state on the server, then push the local app
  // state to the server
  const pullLatestAppFromServer = useCallback(
    async (app: AppState): Promise<SyncResponse> => {
      if (!isSessionActive(await getSession())) {
        return { error: null };
      }
      let response = await supabase
        .from('dashboards')
        .select('raw_data')
        // Always ensure the dashboard matching the specified ID is fetched from
        // the server
        .match({ id: app.id });
      if (response?.error) {
        return response;
      }
      // If the dashboard matching the specified ID can't be found, pull down
      // the most recent dashboard from the server
      if (!(response.data && response.data.length > 0)) {
        response = await supabase
          .from('dashboards')
          .select('raw_data')
          .order('updated_at', { ascending: false })
          .limit(1);
      }
      // If still the query returns empty, then that implies the user has no
      // dashboards associated with their account; only at this point, will it
      // be safe to push the local dashboard and its widgets
      if (!(response.data && response.data.length > 0)) {
        return pushAppToServer(app, { includeWidgets: true });
      }
      const newApp: AppState = response.data[0].raw_data;
      return applyServerAppToLocalApp(newApp, dispatchToApp);
    },
    [dispatchToApp, pushAppToServer]
  );

  // A throttled version of the above pullLatestAppFromServer() function
  const pullLatestAppFromServerThrottled = useMemo(() => {
    // Even though this function has no dependencies (and therefore can
    // technically be defined outside of the hook), we need to ensure that Jest
    // is able to set up the fake timer mechanism (in the corresponding Sync
    // tests) before this throttled function is created; otherwise, some tests
    // will intermittently fail because the throttle() call bound itself to the
    // native setTimeout() before Jest was able to set up the fake timers
    return throttle(pullLatestAppFromServer, 1000);
  }, [pullLatestAppFromServer]);

  // Pull latest data from server on initial app load
  const isDefaultAppState = app.id === undefined && app.isDefaultApp;
  useEffect(() => {
    if (app.id) {
      pullLatestAppFromServerThrottled(app);
    }
    // We only want to pull the latest app data once per page load, when the
    // default app state is replaced by the app from localStorage (hence why we
    // pass the boolean variable as a dependency instead of passing app.id); if
    // we were to pass app.id, the import functionality would break because the
    // imported dashboard would have a randomized (but non-empty) UUID, which
    // would cause this hook to pull the previous dashboard from the server and
    // overwrite the imported dashboard state entirely
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [isDefaultAppState]);

  return { pullLatestAppFromServer, pushAppToServer };
}

export default useAppSync;
