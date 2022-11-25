import { throttle } from 'lodash-es';
import { Dispatch, useEffect, useMemo } from 'react';
import { getUser, isSessionActive } from '../accountUtils';
import { supabase } from '../supabaseClient';
import { getClientId } from '../syncUtils';
import useSyncPush from '../useSyncPush';
import { WidgetHead, WidgetState } from '../widgets/widget';
import widgetSyncService from '../widgets/widgetSyncService';
import { AppState } from './app.d';
import { AppAction } from './AppReducer';

// Take the new app/dashboard state from the server and apply it to the local
// application
async function applyServerAppToLocalApp(
  newApp: AppState,
  dispatchToApp: Dispatch<AppAction>
): Promise<void> {
  if (!(await isSessionActive())) {
    return;
  }
  dispatchToApp({
    type: 'replaceApp',
    payload: newApp
  });
  const { data, error } = await supabase.from('widgets').select('raw_data');
  if (!(data && data.length > 0)) {
    return;
  }
  const newWidgets: WidgetState[] = data.map((widgetRow) => {
    return JSON.parse(widgetRow.raw_data);
  });
  newWidgets.forEach((widget) => {
    widgetSyncService.broadcastPull(widget.id, widget);
  });
}

// Push the local application state to the server; this function runs when the
// app changes, but also once when there is no app state on the server
async function pushLocalAppToServer(app: AppState) {
  if (!app.id) {
    return;
  }
  const user = await getUser();
  if (!user) {
    return;
  }
  await supabase.from('dashboards').upsert([
    {
      id: app.id,
      user_id: user.id,
      client_id: getClientId(),
      raw_data: JSON.stringify(app),
      updated_at: new Date().toISOString()
    }
  ]);
}

// Push all local widgets to the server (this is only necessary as a one-time
// operation)
function pushLocalWidgetsToServer(app: AppState): void {
  app.widgets.forEach((widgetHead: WidgetHead) => {
    widgetSyncService.broadcastPush(widgetHead.id);
  });
}

// The useAppSync() hook mangages the sychronization of the app state between
// the client and server, pushing and pulling data as appropriate
function useAppSync(app: AppState, dispatchToApp: Dispatch<AppAction>): void {
  // Push the local app state to the server every time the app state changes
  // locally; please note that this push operation is debounced
  useSyncPush({
    state: app,
    stateType: 'app',
    upsertState: pushLocalAppToServer
  });

  // Replace the local application state with the latest application state from
  // the server; if there is no app state on the server, then push the local app
  // state to the server
  const pullLatestAppFromServer = useMemo(() => {
    // Even though this function has no dependencies (and therefore can
    // technically be defined outside of the hook), we need to ensure that Jest
    // is able to set up the fake timer mechanism (in the corresponding Sync
    // tests) before this throttled function is created; otherwise, some tests
    // will intermittently fail because the throttle() call bound itself to the
    // native setTimeout() before Jest was able to set up the fake timers
    return throttle(
      async (
        app: AppState,
        dispatchToApp: Dispatch<AppAction>
      ): Promise<void> => {
        if (!(await isSessionActive())) {
          return;
        }
        const { data, error } = await supabase
          .from('dashboards')
          .select('raw_data');
        if (!(data && data.length > 0)) {
          pushLocalAppToServer(app);
          pushLocalWidgetsToServer(app);
          return;
        }
        const newApp: AppState = JSON.parse(data[0].raw_data);
        applyServerAppToLocalApp(newApp, dispatchToApp);
      },
      1000
    );
  }, []);

  // Pull latest data from server on initial app load
  useEffect(() => {
    if (app.id) {
      pullLatestAppFromServer(app, dispatchToApp);
    }
    // We only want to pull the latest app data when the app ID changes
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [app.id]);
}

export default useAppSync;
