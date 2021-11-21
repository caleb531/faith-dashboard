import React, { useReducer, useEffect } from 'react';
import { AppContext } from './AppContext';
import { AppState, AppTheme } from './App.d';
import AppHeader from './AppHeader';
import AppFooter from './AppFooter';
import WidgetBoard from './WidgetBoard';
import { WidgetType } from './Widget.d';
import { useLocalStorage } from './hooks';
import defaultApp from '../json/app.json';

export function reducer(state, action): AppState {
  switch (action.type) {
    case 'changeTheme':
      return {
        ...state,
        theme: action.payload
      };
    case 'addWidget':
      return {...state, widgets: [...state.widgets, action.payload]};
    case 'updateWidget':
      return {
        ...state,
        widgets: state.widgets.map((widget) => {
          return (widget.id === action.payload.id)
            ? {...action.payload}
            : widget;
        })
      };
    case 'moveWidget':
      const { widgetToMove, sourceIndex, sourceColumn, destinationIndex, destinationColumn } = action.payload;
      const newDestinationIndex = (destinationColumn !== sourceColumn && destinationIndex > sourceIndex)
        ? (destinationIndex - 1)
        : destinationIndex;
      const newWidgets = state.widgets.filter(
        (widget) => widget.id !== widgetToMove.id);
        newWidgets.splice(newDestinationIndex, 0, { ...widgetToMove, column: destinationColumn });
      return {...state, widgets: newWidgets};
    default:
      return state;
  }
}

function App() {

  const [restoreApp, saveApp] = useLocalStorage('faith-dashboard-app', defaultApp);
  const [app, dispatchApp] = useReducer(reducer, restoreApp());

  useEffect(() => {
    saveApp(app);
  }, [app, saveApp]);

  return (
    <AppContext.Provider value={{ app, dispatchApp }}>
      <div className={`app theme-${app.theme}`}>
        <AppHeader />
        <WidgetBoard />
        <AppFooter />
      </div>
    </AppContext.Provider>
  );

}

export default App;
