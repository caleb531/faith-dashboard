import { User } from '@supabase/supabase-js';
import { Dispatch, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { pageSessionId } from '../syncUtils';
import useSyncPush from '../useSyncPush';
import { WidgetAction } from './useWidgetShell';
import { WidgetState } from './widget';
import widgetSyncService from './widgetSyncService';

// Push the local widget state to the server; this function runs when the
// widget changes, but also once when there is no widget state on the server
async function pushLocalWidgetToServer({ state, user }: { state: WidgetState, user: User }) {
  if (state.isLoading) {
    return;
  }
  console.log(`widget push`, state);
  await supabase
    .from('widgets')
    .upsert([
      {
        id: state.id,
        user_id: user.id,
        page_session_id: pageSessionId,
        raw_data: JSON.stringify(state)
      }
    ]);
}

// The useWidgetSync() hook mangages the sychronization of the widget state
// between the client and server, pushing and pulling data as appropriate
function useWidgetSync(
  widget: WidgetState,
  dispatchToWidget: Dispatch<WidgetAction>
): void {

  // Push the local widget state to the server every time the widget state
  // changes locally; please note that this push operation is debounced
  useSyncPush<WidgetState>({
    state: widget,
    stateType: 'widget',
    upsertState: pushLocalWidgetToServer
  });

  // Use a ref to keep track of the current state of the widget without
  // requiring us to add `widget` to the dependency array of the `onPush`
  // useEffect() below
  const widgetRef = useRef(widget);
  useEffect(() => {
    widgetRef.current = widget;
  }, [widget]);

  // Listen for broadcasts to push the state of the widget to the server (this
  // is typically only done if the widget state doesn't already exist on the
  // server, otherwise we only push based on changes to the widget state)
  useEffect(() => {
    if (!supabase.auth.session()) {
      return;
    }
    widgetSyncService.onPush(widget.id, () => {
      const user = supabase.auth.user();
      if (user) {
        pushLocalWidgetToServer({
          state: widgetRef.current,
          user
        });
      }
    });
    return () => {
      widgetSyncService.offPush(widget.id);
    };
  }, [widget.id]);

  // When useAppSync() detects that there is widget data to pull in from the
  // server (for this particular widget), detect that change and replace the
  // local widget state with the new widget state from the server
  useEffect(() => {
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
