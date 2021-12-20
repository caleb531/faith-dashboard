import React, { useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { AppContext } from '../app/AppContext';
import { WidgetHead, WidgetType } from '../widgets/widget.d';
import AddWidgetButton from './AddWidgetButton';

type Props = { widgetType: WidgetType, onAddWidget: () => void };

function AddWidgetEntry({ widgetType, onAddWidget }: Props) {

  const dispatchToApp = useContext(AppContext);

  function addWidget() {
    dispatchToApp({
      type: 'addWidget',
      payload: {
        id: uuidv4(),
        type: widgetType.type,
        column: 1
      } as WidgetHead
    });
    // Call user-defined callback passed to component
    onAddWidget();
  }

  return (
    <div className="add-widget-entry">
      <header className="add-widget-entry-header">
        <h2 className="add-widget-entry-heading">
          {widgetType.name}
          <img src={`icons/${widgetType.icon}.svg`} alt="" className="add-widget-entry-icon" />
        </h2>
        <AddWidgetButton onPressButton={addWidget} />
      </header>
      <p className="add-widget-entry-description">{widgetType.description}</p>
    </div>
  );

}

export default AddWidgetEntry;
