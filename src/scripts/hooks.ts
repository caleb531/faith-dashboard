import { useContext, useEffect } from 'react';
import { AppContext } from './AppContext';

export function useWidgetUpdater(widget, widgetData) {

  const { dispatchApp } = useContext(AppContext);

  // Update widget list when changes are made
  useEffect(() => {
    dispatchApp({
      type: 'updateWidget',
      payload: { ...widget, data: widgetData }
    });
  }, [widget, widgetData, dispatchApp]);

}
