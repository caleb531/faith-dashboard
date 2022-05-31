import { User } from '@supabase/supabase-js';
import { Dispatch, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { pageSessionId } from '../syncUtils';
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
  if (!supabase.auth.session()) {
    return;
  }
  console.log('app on server', newApp);
  dispatchToApp({
    type: 'replaceApp',
    payload: newApp
  });
  const { data, error } = await supabase
    .from('widgets')
    .select('*');
  if (!(data && data.length > 0)) {
    console.log('no widgets to pull');
    return;
  }
  console.log('widget data', data);
  const newWidgets: WidgetState[] = data.map((widgetRow) => {
    return JSON.parse(widgetRow.raw_data);
  });
  newWidgets.forEach((widget) => {
    widgetSyncService.broadcastPull(widget.id, widget);
  });
}

// Replace the local application state with the latest application state from
// the server; if there is no app state on the server, then push the local app
// state to the server
async function pullLatestAppFromServer(
  app: AppState,
  dispatchToApp: Dispatch<AppAction>
): Promise<void> {
  if (!supabase.auth.session()) {
    return;
  }
  const { data, error } = await supabase
      .from('dashboards')
      .select('*');
  if (!(data && data.length > 0)) {
    console.log('no app to pull');
    const user = supabase.auth.user();
    if (user) {
      pushLocalAppToServer({ state: app, user });
      pushLocalWidgetsToServer({ app, user });
    }
    return;
  }
  const newApp: AppState = JSON.parse(data[0].raw_data);
  applyServerAppToLocalApp(newApp, dispatchToApp);
}

// Push the local application state to the server; this function runs when the
// app changes, but also once when there is no app state on the server
async function pushLocalAppToServer({
  state,
  user
}: {
  state: AppState,
  user: User
}) {
  if (!state.id) {
    return;
  }
  console.log(`app push`, state);
  await supabase
    .from('dashboards')
    .upsert([
      {
        id: state.id,
        user_id: user.id,
        page_session_id: pageSessionId,
        raw_data: JSON.stringify(state)
      }
    ]);
}

// Push all local widgets to the server (this is only necessary as a one-time
// operation)
function pushLocalWidgetsToServer({
  app,
  user
}: {
  app: AppState,
  user: User
}): void {
  app.widgets.forEach((widgetHead: WidgetHead) => {
    widgetSyncService.broadcastPush(widgetHead.id);
  });
}

// The useAppSync() hook mangages the sychronization of the app state between
// the client and server, pushing and pulling data as appropriate
function useAppSync(
  app: AppState,
  dispatchToApp: Dispatch<AppAction>
): void {

  // Push the local app state to the server every time the app state changes
  // locally; please note that this push operation is debounced
  useSyncPush({
    state: app,
    stateType: 'app',
    upsertState: pushLocalAppToServer
  });

  // Pull latest data from server on initial app load
  useEffect(() => {
    pullLatestAppFromServer(app, dispatchToApp);
  // We only want to pull the latest app data when initially loading the app
  /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, []);

}

export default useAppSync;
