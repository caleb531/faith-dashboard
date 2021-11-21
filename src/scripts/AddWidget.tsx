import React, { useContext } from 'react';
import { AppContext } from './AppContext';

function AddWidget() {

  const { app, dispatchApp } = useContext(AppContext);

  return (
    <div className="add-widget-area">
      <button className="add-widget-button">Add Widget</button>
    </div>
  );

}

export default AddWidget;
