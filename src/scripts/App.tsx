import React, { useReducer } from 'react';
import { AppContext } from './AppContext';
import AppHeader from './AppHeader';
import WidgetBoard from './WidgetBoard';
import { AppState } from './App.d';

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
    theme: 'green',
    widgets: []
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
