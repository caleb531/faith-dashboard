import { Dispatch, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { getClientId } from '../syncUtils';
import useSyncPush from '../useSyncPush';
import { WidgetAction } from './useWidgetShell';
import { WidgetState } from './widget';
import widgetSyncService from './widgetSyncService';

// Push the local widget state to the server; this function runs when the
// widget changes, but also once when there is no widget state on the server
async function pushLocalWidgetToServer(widget: WidgetState) {
  if (widget.isLoading || widget.isRemoving) {
    return;
  }
  const user = supabase.auth.user();
  if (!user) {
    return;
  }
  await supabase
    .from('widgets')
    .upsert([
      {
        id: widget.id,
        user_id: user.id,
        client_id: getClientId(),
        raw_data: JSON.stringify(widget),
        updated_at: new Date().toISOString()
      }
    ]);
}

// Delete the widget from the server if it's removed from the local dashboard
async function deleteLocalWidgetFromServer(widget: WidgetState) {
  const user = supabase.auth.user();
  if (!user) {
    return;
  }
  await supabase
    .from('widgets')
    .delete()
    .match({
      id: widget.id,
      user_id: user.id
    });
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
      if (!user) {
        return;
      }
      pushLocalWidgetToServer(widgetRef.current);
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
      dispatchToWidget({ type: 'replaceWidget', payload: newWidget });
    });
    return () => {
      widgetSyncService.offPull(widget.id);
    };
  }, [widget.id, dispatchToWidget]);

  // Delete widget from database when the widget is removed from the local
  // dashboard
  useEffect(() => {
    if (widget.isRemoving) {
      deleteLocalWidgetFromServer(widget);
    }
  }, [widget]);

}

export default useWidgetSync;
