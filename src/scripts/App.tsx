import React, { useReducer, useEffect } from 'react';
import { AppContext } from './AppContext';
import { AppState, AppTheme } from './App.d';
import AppHeader from './AppHeader';
import AppFooter from './AppFooter';
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
            id: '2c342850-2237-4dab-8b08-b10cae7c7a4e',
            type: WidgetType.BibleVerse,
            width: 300,
            height: 200,
            data: {}
          },
          {
            id: '50546223-76c8-4643-a402-87c4cf213849',
            type: WidgetType.Note,
            width: 300,
            height: 200,
            data: {}
          },
          {
            id: '4deca405-3e4e-4baa-94c8-82ebf5bcbcde',
            type: WidgetType.BibleVerse,
            width: 300,
            height: 200,
            data: {}
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
        <AppFooter />
      </div>
    </AppContext.Provider>
  );

}

export default App;
