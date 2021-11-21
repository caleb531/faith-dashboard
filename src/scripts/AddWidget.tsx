import React, { useContext, useState } from 'react';
import { AppContext } from './AppContext';
import AddWidgetPicker from './AddWidgetPicker';

function AddWidget() {

  const { app, dispatchApp } = useContext(AppContext);
  const [widgetPickerIsOpen, setWidgetPickerIsOpen] = useState(false);

  function displayWidgetPicker() {
    setWidgetPickerIsOpen(true);
  }

  return (
    <div className="add-widget-area">
      <button className="add-widget-button" onClick={displayWidgetPicker}>Add Widget</button>
      {widgetPickerIsOpen ? (
        <AddWidgetPicker setWidgetPickerIsOpen={setWidgetPickerIsOpen} />
      ) : null}
    </div>
  );

}

export default AddWidget;
