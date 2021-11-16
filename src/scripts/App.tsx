import React, { useReducer, useEffect } from 'react';
import { AppContext } from './AppContext';
import { AppState, AppTheme } from './App.d';
import AppHeader from './AppHeader';
import WidgetBoard from './WidgetBoard';
import { WidgetType } from './Widget.d';

function App() {

  function reducer(state, action): AppState {
    switch (action.type) {
      case 'changeTheme':
        return {
          ...state,
          theme: action.payload
        };
      case 'addWidget':
        return {...state, widgets: [...state.widgets, action.payload]};
      case 'updateWidget':
        // Updates an existing widget in-place, so the order of widgets is
        // completely preserved; this is done by findind the index of the
        // existing widget, and then rebuilding the array around that to be
        // part of the next immutable state
        const widgetIndex = state.widgets.findIndex(
          (widget) => widget.id === action.payload.id);
        return {
          ...state,
          widgets: [
            ...state.widgets.filter((_widget, w) => w < widgetIndex),
            action.payload,
            ...state.widgets.filter((_widget, w) => w > widgetIndex)
          ]
        };
      default:
        return state;
    }
  }

  function restoreApp() {
    const appState = JSON.parse(localStorage.getItem('faith-dashboard-app'));
    if (appState) {
      return appState;
    } else {
      return {
        theme: AppTheme.teal,
        widgets: [
          {
            id: 1,
            type: WidgetType.BibleVerse,
            width: 300,
            height: 200,
            data: {
              verseQuery: ''
            }
          }
        ]
      };
    }
  }

  const [app, dispatchApp] = useReducer(reducer, restoreApp());

  useEffect(() => {
    localStorage.setItem('faith-dashboard-app', JSON.stringify(app));
  }, [app]);

  return (
    <AppContext.Provider value={{ app, dispatchApp }}>
      <div className={`app theme-${app.theme}`}>
        <AppHeader />
        <WidgetBoard />
      </div>
    </AppContext.Provider>
  );

}

export default App;
