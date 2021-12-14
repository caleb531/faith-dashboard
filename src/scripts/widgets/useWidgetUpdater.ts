import { useEffect } from 'react';
import { WidgetState } from './widget.d';

// The useWidgetUpdater() hook persists updates to the widget in the global
// application state; do not call this hook directly, but rather, call the
// useWidgetShell() hook, which already makes use of useWidgetUpdater()
export default function useWidgetUpdater(
  widget: WidgetState,
  saveWidget: (widget: WidgetState) => void,
  removeWidget: () => void
): void {

  // Update widget when changes are made
  useEffect(() => {
    // The saveWidget() function is guaranteed to be stable per the
    if (!widget.isMarkedForRemoval) {
      saveWidget(widget);
    }
  }, [widget, saveWidget]);

  // Purge widget data from localStorage when the widget is being removed
  useEffect(() => {
    if (widget.isMarkedForRemoval) {
      removeWidget();
    }
  }, [widget.isMarkedForRemoval, removeWidget]);

}
