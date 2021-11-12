import React, { useReducer } from 'react';
import { AppContext } from './AppContext';
import AppHeader from './AppHeader';
import WidgetBoard from './WidgetBoard';
import { AppState, AppTheme } from './App.d';

function App() {

  function reducer(app, action): AppState {
    switch (action.type) {
      case 'change-theme':
        return {
          ...app,
          theme: action.payload
        };
      default:
        return app;
    }
  }

  const [app, dispatchApp] = useReducer(reducer, {
    theme: AppTheme.green,
    widgets: [
      {
        id: 1,
        width: 300,
        height: 200
      }
    ]
  });
  console.log('app from app', app);

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
