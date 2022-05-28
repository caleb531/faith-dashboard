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

// The useAppSync() hook
function useAppSync(
  app: AppState,
  dispatchToApp: Dispatch<AppAction>
): void {

  useSyncPush({
    state: app,
    stateType: 'app',
    upsertState: async ({ user }) => {
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
  });

  // Subscribe to changes to the app/dashboard itself
  useEffect(() => {
    const subscription = supabase
      .from('dashboards')
      .on('INSERT', (payload) => {
        applyServerAppToLocalApp(payload.new.raw_data, dispatchToApp);
      })
      .on('UPDATE', (payload) => {
        applyServerAppToLocalApp(payload.new.raw_data, dispatchToApp);
      })
      .subscribe();
    console.log('subscribe');
    return () => {
      console.log('unsubscribe');
      supabase.removeSubscription(subscription);
    };
  }, [dispatchToApp]);

  // Subscribe to changes to individual widgets
  useEffect(() => {
    const subscription = supabase
      .from('widgets')
      .on('UPDATE', (payload) => {
        const widget: WidgetState = payload.new.raw_data;
        widgetSyncService.broadcastPull(widget.id, widget);
      })
      .subscribe();
    console.log('subscribe');
    return () => {
      console.log('unsubscribe');
      supabase.removeSubscription(subscription);
    };
  }, [dispatchToApp]);

  // Pull latest data from server on initial app load
  useEffect(() => {
    pullLatestAppFromServer(dispatchToApp);
  // We only want to pull the latest app data when initially loading the app
  /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, []);

}

export default useAppSync;
