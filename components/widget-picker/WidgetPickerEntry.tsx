import React, { useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import AppContext from '../app/AppContext';
import AddWidgetButton from '../generic/AddWidgetButton';
import { WidgetType } from '../widgets/widget.d';

type Props = {
  widgetType: WidgetType,
  onAddWidget: () => void
};

function WidgetPickerEntry({
  widgetType,
  onAddWidget
}: Props) {

  const dispatchToApp = useContext(AppContext);

  function addWidget() {
    dispatchToApp({
      type: 'addWidget',
      payload: {
        id: uuidv4(),
        type: widgetType.type,
        column: 1,
        isAdding: true
      }
    });
    // Call user-defined callback passed to component
    onAddWidget();
  }

  return (
    <div className="widget-picker-entry">
      <header className="widget-picker-entry-header">
        <h2 className="widget-picker-entry-heading">
          <img src={`icons/${widgetType.icon}.svg`} alt="" className="widget-picker-entry-icon" />
          {widgetType.name}
        </h2>
        <AddWidgetButton onPressButton={addWidget} />
      </header>
      <p className="widget-picker-entry-description">{widgetType.description}</p>
    </div>
  );

}

export default WidgetPickerEntry;
