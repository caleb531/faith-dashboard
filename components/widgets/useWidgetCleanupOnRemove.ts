import { useEffect } from 'react';
import { WidgetState } from './widget.d';

// The useWidgetCleanupOnRemove() hook runs some arbitrary cleanup code
// whenever the user removes a widget from their dashboard
export default function useWidgetCleanupOnRemove(
  widgetToRemove: WidgetState,
  onRemove: () => void
): void {

  // Run arbitrary cleanup code when widget is removed from dashboard
  useEffect(() => {
    // The widget is unmounted when the widget is removed, but the widget can
    // also be un-mounted (then subsequently re-mounted) when the widget is
    // moved to a different column; therefore, when the user clicks the Remove
    // Widget control in the UI, we mark the widget for removal so that we know
    // when to actually run the below cleanup code
    if (widgetToRemove.isRemoving) {
      onRemove();
    }
  }, [onRemove, widgetToRemove.isRemoving]);

}
