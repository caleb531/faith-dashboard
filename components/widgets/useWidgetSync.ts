import { supabase } from '../supabaseClient';
import useSyncPush from '../useSyncPush';
import { WidgetState } from './widget';

// The useWidgetSync() hook pushes the state of the given widget to the server
// whenever it changes
function useWidgetSync(
  widget: WidgetState
): void {

  useSyncPush({
    state: widget,
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

}

export default useWidgetSync;
