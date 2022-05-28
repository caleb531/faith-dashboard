import { Dispatch, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import useSyncPush from '../useSyncPush';
import { WidgetAction } from './useWidgetShell';
import { WidgetState } from './widget';
import widgetSyncService from './widgetSyncService';

// The useWidgetSync() hook pushes the state of the given widget to the server
// whenever it changes
function useWidgetSync(
  widget: WidgetState,
  dispatchToWidget: Dispatch<WidgetAction>
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
    console.log('listening for widget pull', widget.id);
    widgetSyncService.onPull(widget.id, (newWidget) => {
      console.log('apply widget from server', newWidget);
      dispatchToWidget({ type: 'replaceWidget', payload: newWidget });
    });
    return () => {
      widgetSyncService.offPull(widget.id);
    };
  }, [widget.id, dispatchToWidget]);

}

export default useWidgetSync;
