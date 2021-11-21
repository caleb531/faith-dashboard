import React, { useReducer, useEffect } from 'react';
import { AppContext } from './AppContext';
import { AppState, AppTheme } from './App.d';
import AppHeader from './AppHeader';
import AppFooter from './AppFooter';
import WidgetBoard from './WidgetBoard';
import { WidgetType } from './Widget.d';
import { useLocalStorage } from './hooks';

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

  const [restoreApp, saveApp] = useLocalStorage('faith-dashboard-app', {
    theme: AppTheme.teal,
    widgets: [
      {
        id: '2c342850-2237-4dab-8b08-b10cae7c7a4e',
        type: WidgetType.BibleVerse,
        column: 1,
        data: {}
      },
      {
        id: '50546223-76c8-4643-a402-87c4cf213849',
        type: WidgetType.Note,
        column: 1,
        data: {}
      },
      {
        id: '4deca405-3e4e-4baa-94c8-82ebf5bcbcde',
        type: WidgetType.BibleVerse,
        column: 2,
        data: {}
      },
      {
        id: '0f0923aa-6ba1-4958-9168-41a5085a57c2',
        type: WidgetType.Note,
        column: 3,
        data: {}
      }
    ]
  });
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
