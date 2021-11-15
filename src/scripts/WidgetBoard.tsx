import React, { useContext, useReducer, useEffect } from 'react';
import { AppContext } from './AppContext';
import Widget from './Widget';

function WidgetBoard() {

  const { app, dispatchApp } = useContext(AppContext);

  return (
    <div className="widget-board">
      {app.widgets.map((widget) => {
        return (<Widget widget={widget} key={widget.id} />);
      })}
    </div>
  );

}

export default WidgetBoard;
