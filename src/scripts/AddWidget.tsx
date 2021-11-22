import React, { useContext, useState } from 'react';
import { AppContext } from './AppContext';
import AddWidgetButton from './AddWidgetButton';
import AddWidgetPicker from './AddWidgetPicker';

function AddWidget() {

  const { app, dispatchApp } = useContext(AppContext);
  const [widgetPickerIsOpen, setWidgetPickerIsOpen] = useState(false);

  return (
    <div className="add-widget-area">
      <AddWidgetButton onPressButton={() => setWidgetPickerIsOpen(true)} />
      {widgetPickerIsOpen ? (
        <AddWidgetPicker
          onCloseWidgetPicker={() => setWidgetPickerIsOpen(false)} />
      ) : null}
    </div>
  );

}

export default AddWidget;
