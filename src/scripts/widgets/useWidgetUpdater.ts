import { useContext, useEffect } from 'react';
import { AppContext } from '../app/AppContext';
import { WidgetState } from '../types.d';

export default function useWidgetUpdater(widget: WidgetState): void {

  const { dispatchToApp } = useContext(AppContext);

  // Update widget list when changes are made
  useEffect(() => {
    dispatchToApp({
      type: 'updateWidget',
      payload: {
        ...widget,
        column: widget.column || 1
      }
    });
  }, [widget]);

}
