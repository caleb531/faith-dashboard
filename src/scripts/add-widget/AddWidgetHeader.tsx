import React, { useState } from 'react';
import AddWidgetButton from './AddWidgetButton';
import AddWidgetPicker from './AddWidgetPicker';

function AddWidgetHeader() {

  const [widgetPickerIsOpen, setWidgetPickerIsOpen] = useState(false);

  return (
    <div className="add-widget-header">
      <AddWidgetButton onPressButton={() => setWidgetPickerIsOpen(true)} />
      {widgetPickerIsOpen ? (
        <AddWidgetPicker
          onCloseWidgetPicker={() => setWidgetPickerIsOpen(false)} />
      ) : null}
    </div>
  );

}

export default AddWidgetHeader;
