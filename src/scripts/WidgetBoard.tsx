import React, { useContext, useReducer, useEffect } from 'react';
import { AppContext } from './AppContext';
import { WidgetBoardContext } from './WidgetBoardContext';
import Widget from './Widget';

function WidgetBoard() {

  const { app, dispatchApp } = useContext(AppContext);

  function reducer(state, action) {
    switch (action.type) {
      case 'addWidget':
        return [...state, action.payload];
      case 'updateWidget':
        return [
          ...state.filter((widget) => widget.id !== action.payload.id),
          action.payload
        ];
      default:
        return state;
    }
  }

  const [widgets, dispatchWidgets] = useReducer(reducer, app.widgets);

  useEffect(() => {
    dispatchApp({type: 'updateApp', payload: { widgets }});
  }, [widgets, dispatchApp]);

  return (
    <WidgetBoardContext.Provider value={{dispatchWidgets}}>
    <div className="widget-board">
      {widgets.map((widget) => {
        return (<Widget widget={widget} key={widget.id} />);
      })}
    </div>
    </WidgetBoardContext.Provider>
  );

}

export default WidgetBoard;
