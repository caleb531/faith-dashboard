import AppContext from '@components/app/AppContext';
import Icon from '@components/reusable/Icon';
import { useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import AddWidgetButton from '../reusable/AddWidgetButton';
import { WidgetType } from '../widgets/widget.types';

type Props = {
  widgetType: WidgetType;
  onAddWidget: () => void;
};

function WidgetPickerEntry({ widgetType, onAddWidget }: Props) {
  const { dispatchToApp } = useContext(AppContext);

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
          <Icon name={widgetType.icon} />
          {widgetType.name}
        </h2>
        <AddWidgetButton
          onPressButton={addWidget}
          aria-label={`Add ${widgetType.name} Widget`}
        />
      </header>
      <p className="widget-picker-entry-description">
        {widgetType.description}
      </p>
    </div>
  );
}

export default WidgetPickerEntry;
