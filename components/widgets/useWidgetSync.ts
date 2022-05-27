import { useEffect } from 'react';
import { supabase } from '../supabaseClient';
import useObjectHasChanged from '../useObjectHasChanged';
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

  const [getWidgetChanges] = useObjectHasChanged(widget);

  useEffect(() => {
    const changes = getWidgetChanges();
    if (changes && Object.keys(changes).length > 0) {
      console.log('widget push', changes);
      pushWidgetToDatabase(widget);
    } else {
      console.log('no widget changes to merge');
    }
  });

}

export default useWidgetSync;
