import { useContext, useEffect } from 'react';
import { AppContext } from '../app/AppContext';
import { WidgetState } from '../types.d';

// The useWidgetUpdater() hook persists updates to the widget in the global
// application state; do not call this hook directly, but rather, call the
// useWidgetShell() hook, which already makes use of useWidgetUpdater()
export default function useWidgetUpdater(widget: WidgetState): void {

  const dispatchToApp = useContext(AppContext);

  // Update widget list when changes are made
  useEffect(() => {
    dispatchToApp({
      type: 'updateWidget',
      payload: widget
    });
  }, [widget, dispatchToApp]);

}
