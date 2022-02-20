import React, { useState } from 'react';
import AddWidgetButton from '../generic/AddWidgetButton';
import TutorialMessage from '../tutorial/TutorialMessage';
import useTutorialStep from '../tutorial/useTutorialStep';
import WidgetPicker from '../widget-picker/WidgetPicker';

function AppHeaderAddWidgetButton() {
  const { isCurrentStep, stepProps } = useTutorialStep('add-widget');
  const [widgetPickerIsOpen, setWidgetPickerIsOpen] = useState(false);
  return (
    <div className="app-header-add-widget-wrapper">
      <AddWidgetButton
        onPressButton={() => setWidgetPickerIsOpen((isOpen) => !isOpen)}
        buttonProps={stepProps} />
      {isCurrentStep ? <TutorialMessage /> : null}
      {widgetPickerIsOpen ? (
        <WidgetPicker onCloseWidgetPicker={() => setWidgetPickerIsOpen(false)} />
      ) : null}
    </div>
  );
}

export default AppHeaderAddWidgetButton;
