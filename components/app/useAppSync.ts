import { User } from '@supabase/supabase-js';
import { Dispatch, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import useSyncPush from '../useSyncPush';
import { WidgetState } from '../widgets/widget';
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
    .select('raw_data');
  if (!(data && data.length > 0)) {
    console.log('no widgets to pull');
    return;
  }
  console.log('widget data', data);
  const newWidgets: WidgetState[] = data.map((widgetRow) => {
    return JSON.parse(widgetRow.raw_data);
  });
  newWidgets.forEach((widget) => {
    console.log('broadcast widget pull', widget);
    widgetSyncService.broadcastPull(widget.id, widget);
  });
}

async function pullLatestAppFromServer(
  dispatchToApp: Dispatch<AppAction>
): Promise<void> {
  if (!supabase.auth.session()) {
    return;
  }
  const { data, error } = await supabase
      .from('dashboards')
      .select('raw_data');
  if (!(data && data.length > 0)) {
    console.log('no app to pull');
    return;
  }
  const newApp: AppState = JSON.parse(data[0].raw_data);
  applyServerAppToLocalApp(newApp, dispatchToApp);
}

async function pushLocalAppToServer({ state, user }: { state: AppState, user: User }) {
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

// The useAppSync() hook
function useAppSync(
  app: AppState,
  dispatchToApp: Dispatch<AppAction>
): void {

  useSyncPush({
    state: app,
    stateType: 'app',
    upsertState: pushLocalAppToServer
  });

  // Pull latest data from server on initial app load
  useEffect(() => {
    pullLatestAppFromServer(dispatchToApp);
  // We only want to pull the latest app data when initially loading the app
  /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, []);

}

export default useAppSync;
