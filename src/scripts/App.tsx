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
        return {
          ...state,
          widgets: [
            ...state.widgets.filter((widget) => widget.id !== action.payload.id),
            action.payload
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
