import React, { useContext, useState } from 'react';
import { AppContext } from './AppContext';
import AddWidgetButton from './AddWidgetButton';
import AddWidgetModal from './AddWidgetModal';

function AddWidget() {

  const { app, dispatchApp } = useContext(AppContext);
  const [widgetPickerIsOpen, setWidgetPickerIsOpen] = useState(false);

  return (
    <div className="add-widget-area">
      <AddWidgetButton onPressButton={() => setWidgetPickerIsOpen(true)} />
      {widgetPickerIsOpen ? (
        <AddWidgetModal
          onCloseWidgetPicker={() => setWidgetPickerIsOpen(false)} />
      ) : null}
    </div>
  );

}

export default AddWidget;
