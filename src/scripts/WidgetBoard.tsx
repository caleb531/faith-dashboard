import React, { useContext } from 'react';
import { AppContext } from './AppContext';
import Widget from './Widget';

function WidgetBoard(props) {

  const { app } = useContext(AppContext);

  return (
    <div className="widget-board">
      {app.widgets.map((widget) => {
        return (<Widget widget={widget} key={widget.id} />);
      })}
    </div>
  );

}

export default WidgetBoard;
