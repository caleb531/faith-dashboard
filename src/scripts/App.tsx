import React, { useReducer, useEffect } from 'react';
import { AppContext } from './AppContext';
import { AppState, AppTheme } from './App.d';
import AppHeader from './AppHeader';
import WidgetBoard from './WidgetBoard';
import { WidgetType } from './Widget.d';

function App() {

  function reducer(app, action): AppState {
    switch (action.type) {
      case 'change-theme':
        return {
          ...app,
          theme: action.payload
        };
      case 'save-app':
        return app;
      default:
        return app;
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
  console.log('app from app', app);

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
