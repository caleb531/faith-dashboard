import React, { useReducer, useEffect } from 'react';
import { sortBy } from 'lodash-es';
import { AppContext } from './AppContext';
import { AppState, StateAction, AppTheme, WidgetState, WidgetMoveParameters } from '../types.d';
import LoadingIndicator from '../generic/LoadingIndicator';
import UpdateNotification from './UpdateNotification';
import AppHeader from './AppHeader';
import AppFooter from './AppFooter';
import useLocalStorage from './useLocalStorage';
import defaultApp from './appStateDefault';

// Lazy-load the widget board since react-beautiful-dnd is a large dependency
const WidgetBoard = React.lazy(() => import('../widgets/WidgetBoard'));

export function reducer(state: AppState, action: StateAction): AppState {
  switch (action.type) {
    case 'changeTheme':
      return { ...state, theme: action.payload as AppTheme };
    case 'addWidget':
      const newWidget = action.payload as WidgetState;
      return { ...state, widgets: [newWidget, ...state.widgets] };
    case 'removeWidget':
      const widgetToRemove = action.payload as WidgetState;
      return {
        ...state,
        widgets: state.widgets.filter((widget) => widget.id !== widgetToRemove.id)
      };
    case 'updateWidget':
      const widgetToUpdate = action.payload as WidgetState;
      return {
        ...state,
        widgets: state.widgets.map((widget) => {
          // Only touch the reference of the widget we wish to update
          if (widget.id === widgetToUpdate.id) {
            return { ...widgetToUpdate };
          } else {
            return widget;
          }
        })
      };
    case 'moveWidget':
      const { widgetToMove, sourceIndex, sourceColumn, destinationIndex, destinationColumn } = action.payload as WidgetMoveParameters;
      // The destination index from react-beautiful-dnd assumes that the
      // widget-to-move is still at the source index; however, because the
      // widget is about to be removed from its original position (via the
      // filter), we must adjust the destination index for when we reinsert the
      // widget
      const newDestinationIndex = (destinationColumn !== sourceColumn && destinationIndex > sourceIndex)
        ? (destinationIndex - 1)
        : destinationIndex;
      // Remove the widget from its original position (the source index) in the
      // widgets array
      const newWidgets = state.widgets.filter(
        (widget) => widget.id !== widgetToMove.id);
      // Insert the widget at its new position; also update the column field on
      // the widget itself
      newWidgets.splice(newDestinationIndex, 0, { ...widgetToMove, column: destinationColumn });
      // There are edge cases (when dragging-and-dropping and adding new
      // widgets) where the widgets in a particular column are no longer
      // contiguous in the widgets array; this scenario violates a stipulation
      // from react-beautiful-dnd that the indices of all elements in the same
      // column be contiguous; to fix this, we simply sort the array at the end
      // of every drag (sidenote: Lodash's sortBy is a stable sort, so this
      // will not alter the user order of widgets within the same column)
      return { ...state, widgets: sortBy(newWidgets, 'column') };
    default:
      throw new ReferenceError(`action ${action.type} does not exist on reducer`);
  }
}

function App() {

  const [restoreApp, saveApp] = useLocalStorage('faith-dashboard-app', defaultApp);
  const [app, dispatchToApp] = useReducer(reducer, null, () => restoreApp());

  // Serialize the app to localStorage whenever the app's state changes
  useEffect(() => {
    saveApp(app);
  }, [app, saveApp]);


  return (
    <AppContext.Provider value={{ app, dispatchToApp }}>
      <div className={`app theme-${app.theme}`}>
          {navigator.serviceWorker ? (
            <UpdateNotification />
          ) : null}
          <AppHeader />
          <React.Suspense fallback={<LoadingIndicator />}>
            <WidgetBoard />
          </React.Suspense>
          <AppFooter />
      </div>
    </AppContext.Provider>
  );

}

export default App;
