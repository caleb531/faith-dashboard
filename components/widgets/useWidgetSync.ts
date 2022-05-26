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

// The useWidgetSync() hook
function useWidgetSync(
  widget: WidgetState
) {

  const [widgetHasChanged] = useObjectHasChanged(widget);

  useEffect(() => {
    if (widgetHasChanged()) {
      pushWidgetToDatabase(widget);
    }
  });

}

export default useWidgetSync;
