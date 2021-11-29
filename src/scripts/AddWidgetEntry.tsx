import React, { useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { AppContext } from './AppContext';
import { WidgetType, WidgetState } from './types.d';
import AddWidgetButton from './AddWidgetButton';

function AddWidgetEntry({ widgetType, onAddWidget }: { widgetType: WidgetType, onAddWidget: Function }) {

  const { dispatchApp } = useContext(AppContext);

  function addWidget() {
    // TODO: add the widget by dispatching to the App
    dispatchApp({
      type: 'addWidget',
      payload: {
        id: uuidv4(),
        type: widgetType.type,
        column: 1,
        data: {},
        isSettingsOpen: widgetType.requiresConfiguration || false
      } as WidgetState
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
        <AddWidgetButton onPressButton={() => addWidget()} />
      </header>
      <p className="add-widget-entry-description">{widgetType.description}</p>
    </div>
  );

}

export default AddWidgetEntry;
