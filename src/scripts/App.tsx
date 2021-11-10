import React, { useContext, useReducer } from 'react';
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
  console.log('theme from app', app.theme);

  return (
    <div className={`app theme-${app.theme}`}>
      <AppHeader app={app} dispatchApp={dispatchApp} />
      <WidgetBoard app={app} dispatchApp={dispatchApp} />
    </div>
  );

}

export default App;
