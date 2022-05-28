import { useEffect } from 'react';
import { supabase } from '../supabaseClient';
import useSyncPush from '../useSyncPush';
import { WidgetState } from './widget';
import widgetSyncService from './widgetSyncService';

// The useWidgetSync() hook pushes the state of the given widget to the server
// whenever it changes
function useWidgetSync(
  widget: WidgetState
): void {

  useSyncPush({
    state: widget,
    stateType: 'widget',
    upsertState: async ({ state, user }) => {
      await supabase
        .from('widgets')
        .upsert([
          {
            id: state.id,
            user_id: user.id,
            raw_data: JSON.stringify(state)
          }
        ]);
    }
  });

  useEffect(() => {
    widgetSyncService.onPull(widget.id, (newWidget) => {
      console.log('widget pull', newWidget);
    });
    return () => {
      widgetSyncService.offPull(widget.id);
    };
  }, [widget.id]);

}

export default useWidgetSync;
