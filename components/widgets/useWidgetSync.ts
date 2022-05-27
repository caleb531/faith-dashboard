import { supabase } from '../supabaseClient';
import useSyncPush from '../useSyncPush';
import { WidgetState } from './widget';

// Send the supplied widget data to the widgets table in the database
async function pushWidgetToDatabase(widget: WidgetState): Promise<void> {
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
        raw_data: JSON.stringify(widget)
      }
    ]);
}

// The useWidgetSync() hook pushes the state of the given widget to the server
// whenever it changes
function useWidgetSync(
  widget: WidgetState
): void {

  useSyncPush({
    state: widget,
    upsert: async ({ state, user }) => {
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
